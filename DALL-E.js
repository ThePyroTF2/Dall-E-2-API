const { Configuration, OpenAIApi } = require("openai");
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const flags = yargs(hideBin(process.argv)).argv
const openSite = require('open')
const fs = require('fs')
const simpleGit = require('simple-git');
const { help } = require("yargs");
simpleGit().clean(simpleGit.CleanOptions.FORCE)
const git = simpleGit({baseDir: 'C:/Users/Devin/Desktop/VSCode Projects/DALL-E_2_API'});
const path = require('path')

const version = '1.1.0'
const thisDir = 'C:/Users/Devin/Desktop/VSCode Projects/DALL-E_2_API'

// Setup openai API
const configuration = new Configuration({
    apiKey: process.env.OpenAIKey,
});
const openai = new OpenAIApi(configuration);

let prompt = flags.prompt ? flags.prompt : flags.p
let size = flags.size ? flags.size : (flags.s ? flags.s : '1024x1024')

const fileCheck = async (filePath) => {
    let exists = true
    try {
        await fs.promises.readFile(filePath)
    }
    catch (error) {
        exists = false
    }
    return exists
}

const getDedupedFilePath = async (filePath) => {
    let n = 1
    let ogFileName = path.basename(filePath)
    let ogFileNameSplit = ogFileName.split('.')
    let newFileName = `${ogFileNameSplit[0]} (${n}).${ogFileNameSplit[1]}`
    let newFilePath = `${path.dirname(filePath)}/${newFileName}`

    while(await fileCheck(newFilePath)) {
        n++
        newFileName = `${ogFileNameSplit[0]} (${n}).${ogFileNameSplit[1]}`
        newFilePath = `${path.dirname(filePath)}/${newFileName}`
    }
    return newFilePath
}

const helpCommand = () => {
    console.log("DALL-E | Generates an image using OpenAI's DALL-E 2 API\n\nOptions:\n\n--prompt, -p: [Required] Prompt for DALL-E 2 to generate\n--size, -s: Size of the image, 1024x1024, 512x512, or 256x256. 1024x1024 by default.\n\nCommands:\n\n--help, -h: Displays help\n--version, -v: Displays program information")
}

const versionCommand = () => {
    console.log(`DALL-E v${version}`)
}

const imageGen = async () => {
        if(!prompt) throw new Error('Error: no prompt given.')
        console.log('Generating image...')

        // Generate image from prompt in command-line argument
        const response = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: size
        });
        console.log('Image generated')

        // Get OpenAI-provided URL
        let openAIURL = response.data.data[0].url
        const imgResult = await fetch(openAIURL)

        // Save to a file
        console.log('Saving image...')
        const blob = await imgResult.blob()
        const buffer = Buffer.from(await blob.arrayBuffer())
        let filePathPromptName = `${thisDir}/images/${prompt}.png`
        let isDupe = await fileCheck(filePathPromptName)
        let filePathRealName = isDupe ? await getDedupedFilePath(filePathPromptName) : filePathPromptName

        await fs.writeFile(filePathRealName, buffer, (err) => {
            if(err) throw err
            console.log(`Image saved to ${filePathRealName}`)
        })

        // Push saved image to github repo
        console.log('Uploading to GitHub...')
        await git.add(filePathRealName)
        await git.commit(`Add image. Prompt: ${prompt}`)
        console.log('Uploaded to GitHub')

        // Open URL in browser
        let imageURL = `https://raw.githubusercontent.com/ThePyroTF2/DALL-E-2-API/master/images/${path.basename(filePathRealName)}`
        console.log('Opening image in browser...')
        openSite(imageURL)
        console.log(`Image opened. URL: ${imageURL}`)

        // Add image URL and information to images.json
        console.log('Saving image info to images.json...')
        let images = JSON.parse(fs.readFileSync(`${thisDir}/src/images.json`)).images
        images.push({
            prompt: prompt,
            timestamp: Date.now().toString(),
            url: imageURL
        })
        fs.writeFile(
            `${thisDir}/src/images.json`,
            JSON.stringify({
                images: images
            }, null, 4),
            (err) => {
                if(err) throw err
                console.log(`Image info saved to ${thisDir}/src/images.json`)
            }
        )
        await git.add(`${thisDir}/src/images.json`)
        await git.commit('Add new image to images.json')
        await git.push('origin')
}
const main = async () => {
    try {
        if(flags.help || flags.h) {
            helpCommand()
            return
        }
        if(flags.version || flags.v) {
            versionCommand()
            return
        }
        imageGen()
    }

    catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
}

main()