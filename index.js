const { Configuration, OpenAIApi } = require("openai");
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const flags = yargs(hideBin(process.argv)).argv
const openSite = require('open')
const fs = require('fs')
const simpleGit = require('simple-git')
simpleGit().clean(simpleGit.CleanOptions.FORCE)
const git = simpleGit();

// Setup openai API
const configuration = new Configuration({
    apiKey: process.env.OpenAIKey,
});
const openai = new OpenAIApi(configuration);

console.log('Generating image...')

const main = async () => {
    try {
        if(!flags.prompt && !flags.p) throw new Error('Error: no prompt given.')
        let prompt = flags.prompt ? flags.prompt : flags.p
        let size = flags.size ? flags.size : (flags.s ? flags.s : '1024x1024')

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
        await fs.writeFile(`./images/${prompt}.png`, buffer, (err) => {
            if(err) throw err
            console.log('Image saved')
        })

        // Push saved image to github repo
        console.log('Uploading to GitHub...')
        await git.add(`images/${prompt}.png`)
        await git.add('images.json')
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
        let images = JSON.parse(fs.readFileSync('images.json')).images
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
        await git.commit('Add new image to images.json')
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