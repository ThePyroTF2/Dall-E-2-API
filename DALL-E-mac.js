const version = '1.1.2'
const OS = 'Mac OS'
const thisDir = '/usr/local/share/DALL-E'

const { Configuration, OpenAIApi } = require("openai");
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const flags = yargs(hideBin(process.argv)).argv
const openSite = require('open')
const fs = require('fs')
const simpleGit = require('simple-git');
simpleGit().clean(simpleGit.CleanOptions.FORCE)
const git = simpleGit({baseDir: thisDir});
const path = require('path')

const ApiKey = JSON.parse(fs.readFileSync(`${thisDir}/API-KEY.json`)).ApiKey

// Setup openai API
const configuration = new Configuration({
    apiKey: ApiKey,
});
const openai = new OpenAIApi(configuration);

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

const getUndupedFilePath = async (filePath) => {
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
    console.log("DALL-E | Generates an image using OpenAI's DALL-E 2 API\n\nOptions:\n\n-prompt, -p: [Required] Prompt for DALL-E 2 to generate\n-size, -s: Size of the image, 1024x1024, 512x512, or 256x256. 1024x1024 by default.\n\nCommands:\n\n-help, -h: Displays help\n-version, -v: Displays program information\n-regen: generates an image using the last prompt given")
}

const versionCommand = () => {
    console.log(`DALL-E v${version} for ${OS}`)
}

const imageGen = async () => {
        let prompt
        let images = JSON.parse(fs.readFileSync(`${thisDir}/src/images.json`)).images
        if(flags.regen) prompt = images[images.length - 1].prompt
        if(flags.prompt || flags.p) prompt = flags.prompt ? flags.prompt : flags.p
        if(!prompt) throw new Error('Error: no prompt given.')
        console.log(`Prompt: ${prompt}\nGenerating image...`)

        // Generate image from prompt in command-line argument
        const response = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: size
        })
        .then(() => {
            console.log('Image generated.')
        })

        // Get OpenAI-provided URL
        let openAIURL = response.data.data[0].url
        const imgResponse = await fetch(openAIURL)

        // Save to a file
        console.log('Saving image...')
        const blob = await imgResponse.blob()
        const buffer = Buffer.from(await blob.arrayBuffer())
        let filePathPromptName = `${thisDir}/images/${prompt}.png`
        let isDupe = await fileCheck(filePathPromptName)
        let filePathRealName = isDupe ? await getUndupedFilePath(filePathPromptName) : filePathPromptName

        await fs.promises.writeFile(filePathRealName, buffer).then(console.log(`Image saved to ${filePathRealName}`))

        // Add image URL and information to images.json
        let imageURL = `https://raw.githubusercontent.com/ThePyroTF2/DALL-E-2-API/master/images/${encodeURIComponent(path.basename(filePathRealName))}`
        console.log('Saving image info to images.json...')
        images.push({
            prompt: prompt,
            timestamp: Date.now().toString(),
            url: imageURL
        })
        await fs.promises.writeFile(
            `${thisDir}/src/images.json`,
            JSON.stringify({
                images: images
            }, null, 4)
        ).then(() => {
            console.log(`Image info saved to ${thisDir}/src/images.json`)
        })

        // Push saved image to github repo
        console.log('Uploading to GitHub...')
        await git.add(thisDir)
        await git.commit(`Add image. Prompt: ${prompt}`)
        await git.push('origin').then(() => {
            console.log('Uploaded to GitHub')
        })

        // Open URL in browser
        console.log('Opening image in browser...')
        openSite(imageURL)
        console.log(`Image opened. URL: ${imageURL}`)
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