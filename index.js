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
const version = '1.0.0'

// Setup openai API
const configuration = new Configuration({
    apiKey: process.env.OpenAIKey,
});
const openai = new OpenAIApi(configuration);

let prompt = flags.prompt ? flags.prompt : flags.p
let size = flags.size ? flags.size : (flags.s ? flags.s : '1024x1024')

const helpCommand = () => {
    console.log("DALL-E | Generates an image using OpenAI's DALL-E 2 API\n\nOptions:\n\n--prompt, -p: [Required] Prompt for DALL-E 2 to generate\n--size, -s: Size of the image, 1024x1024, 512x512, or 256x256. 1024x1024 by default.\n\nCommands:\n\n--help, -h: Displays help\n--version, -v: Displays program information")
}

const versionCommand = () => {
    console.log(`DALL-E v${version}`)
}

const imageGen = async () => {
        if(!flags.prompt && !flags.p) throw new Error('Error: no prompt given.')
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
        await fs.writeFile(`C:/Users/Devin/Desktop/VSCode Projects/DALL-E_2_API/images/${prompt}.png`, buffer, (err) => {
            if(err) throw err
            console.log('Image saved')
        })

        // Push saved image to github repo
        console.log('Uploading to GitHub...')
        await git.add(`images/${prompt}.png`)
        await git.commit(`Add image. Prompt: ${prompt}`)
        await git.push('main')
        console.log('Uploaded to GitHub')

        // Shorten image URL with Bitly
        console.log('Shortening URL...')
        let imageURL = `https://github.com/ThePyroTF2/DALL-E-2-API/tree/master/images/${prompt}.png`
        let imageBitlyRes = await fetch('https://api-ssl.bitly.com/v4/shorten', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.BitlyAPIKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "long_url": imageURL,
                "group_guid": process.env.BitlyGUID
            })
        })
        console.log('Link shortened with Bitly')
        let imageBitlyBody = await imageBitlyRes.json()
        let imageBitlyLink = `https://www.${imageBitlyBody.id}`

        console.log('Opening image in browser...')
        openSite(imageBitlyLink)
        console.log(`Image opened. URL: ${imageBitlyLink}`)

        // Add image URL and information to images.json
        console.log('Saving image info to images.json...')
        let images = JSON.parse(fs.readFileSync('C:/Users/Devin/Desktop/VSCode Projects/DALL-E_2_API/images.json')).images
        images.push({
            prompt: prompt,
            timestamp: Date.now().toString(),
            url: imageBitlyLink
        })
        fs.writeFile(
            'images.json',
            JSON.stringify({
                images: images
            }, null, 4),
            (err) => {
                if(err) throw err
                console.log('Image info saved')
            }
        )
        await git.add('images.json')
        await git.commit('Add new image to images.json')
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