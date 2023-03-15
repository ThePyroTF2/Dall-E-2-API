# A DALL-E image generation script

### ***WARNING: THIS PROJECT IS NOT PLUG-AND-PLAY.***

You need to do some work if you want it to work on your machine. Instructions to do so are below.

I plan on making this easier to copy in the future. Updated instructions will be included.

## Using this script

There are 2 major things that need to get done in order to use this script effectively on your own machine:

- Swap out your OpenAI API info
- Swap out your Github info

Of course, this being a Node script, you'll need to have a proper development environment as well, but that would be the case regardless of the other stuff. Speaking of,

### 1.<br> Development environment

If the words npm, Node, and Javascript are completely foreign to you, you'll need to follow this step. If you're familiar with Node development, just make sure you have it installed. `package.json` has everything you need.

First you'll need to [install Node](https://nodejs.org/en/). I reccomend using `current`. It says `LTS` is recommended for most users, but that's for pansies who are afraid of experimental features. You'll be fine, I promise. Also, I can't promise this will work with `LTS`. I'm using `current` on my machine, and I'm fairly certain this script uses some experimental features which might not be on `LTS`. I'm too lazy to find out. Just trust me, use `current`.

If you skimmed the page instead of just pushing the button immediately, you'll have found out that Node is a way to run javascript from the terminal instead of in the browser. It's basically what makes this thing work.

Node *should* have installed npm, or Node Package Manager, with it. If you feel like it, double-check by running

```bash
npm --version
```

in your terminal.

Oh yeah, quick note: This tutorial assumes you're on a Windows machine. I will note wherever something different needs to be done for Mac OS (linux WIP). Also, all terminal interactions (such as the one I just showed) moving forward should be in Windows Powershell, ***not*** command line. So don't launch `cmd.exe` or anything. Search for 'Terminal', launch that one. *There's also a hotkey. `Win+x; i`, or `Win+x; a` for opening one with admin perms*

npm is a tool that, wait for it, manages packages. You can install applications with it (you can even install npm with npm), but you can also download packages that add cool stuff to javascript, like a function to open websites in the browser.

Now that you've got Node and npm working, you need to [install git](https://git-scm.com/download/win), [install the Github CLI](https://cli.github.com), and set it all up. Git is a bit complicated for me to explain here, but basically it's how you're going to steal my code (you criminal :P).

### 2. <br> Steal my code

Up at the top of the page for this repo, click the `fork` button. You'll need a Github account, so make that if you don't have one. Once you've forked it, visit the page of your new repo.

Pick a place you want the code to go. Not the folder you want it to go in, but the folder you want the folder to go in (so Desktop or Documents would be ideal, instead of Desktop\DALL-E or Documents\DALL-E). Open it in the terminal (navigate to it in explorer, right click -> `Open in terminal` or navigate to it with the cd command in a fresh terminal). Go to your forked repo in your browser. Press the green `Code` button, and go to the `GitHub CLI` tab. Copy the command in the box (it should look like `gh repo clone [Username]/DALL-E-2-API`) and run it in the terminal window you have open. This will copy all of your forked repository into a new folder called, you won't believe it, `DALL-E-2-API`. **From here on out, this is the context you're gonna be in.**

Run

```bash
npm install
```

in the terminal. You'll also need to run this in the `src` directory. This will get all the packages installed.

### 3. <br> Swap out your OpenAI info

The first thing that needs to change is the fact that this script is set up with my OpenAI info. Well, really, it's set up with whatever OpenAI info is in an environment variable that I named for privacy, but you need to do some setup regardless.

First, [sign up for the OpenAI API](https://beta.openai.com/signup). Once signed in, the page should look like this
![A screenshot of the homepage of the OpenAI API webpage](readme.images/OpenAI%20API%20homepage.png)

Click on your profile picture at the top right of the page, and click `View API keys`. Create a new secret key. ***Don't lose this or share it with anyone***.

We're gonna put that secret key in what's called an environment variable. Environment variables are variables that are stored in the OS itself and can be accessed by applications. With this, you can set the value of a variable without having that value visible in the code itself. This is useful for many reasons. In this case, we're using it to keep the API key hidden.

**On windows**, open the start menu and search for 'Edit the system environment variables'. Open the program. Click on the `Environment Variables` button in the bottom right. In the top half, titled 'User variables for [user]', press the `New...` button. Name it whatever you want, and paste the secret key you just generated into the value. You might need to reboot your PC for everything to catch up to this action.

**On Mac OS**, open the terminal and run the command

```bash
export OPENAI_KEY=[API key]
```

The variable name can be different than `OPENAI_KEY` if you wish.

Now, in the DALL-E-2-API folder, open DALL-E.js in any text editor. I recommend using Visual Studio Code, but for our applications, literally something like Windows Notepad would work.

At the top of the file, find the following snippet:

```js
// Setup openai API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});
```

Change that bit that says `OPENAI_KEY` to whatever you named your environment variable just now.

### 4. <br> Swap out your Github info

On line 95 of DALL-E.js, you should see this snippet:

```js
// Open URL in browser
let imageURL = `https://raw.githubusercontent.com/ThePyroTF2/DALL-E-2-API/master/images/${path.basename(filePathRealName)}`
console.log('Opening image in browser...')
openSite(imageURL)
console.log(`Image opened. URL: ${imageURL}`)
```

Change `ThePyroTF2` in the url to whatever your Github username is.

Open `App.tsx`, located in the `src` folder. On line 41, you should see this snippet:

```tsx
useEffect(() => {
    fetch('https://raw.githubusercontent.com/ThePyroTF2/DALL-E-2-API/master/src/images.json')
    .then(res => {
        return res.json()
    })
    .then(data => {
        unstatefulObjectsArray = data
        updateImages(unstatefulObjectsArray)
        setStatefulObjectsArray(unstatefulObjectsArray)
    })
}, [])
```

Make the same username change here.

If you want, you can also change the username at line 58 of `App.tsx` as well.

At line 6 of `package.json`, you should see this line:

```json
"homepage": "https://ThePyroTF2.github.io/DALL-E-2-API",
```

Make the same username change here.

### 5. <br> Finishing touches

On line 2 of `DALL-E.js`, you should see this line:

```js
const thisDir = '/Users/Devin/Documents/DALL-E-2-API'
```

Change the path in the string to the path to your `DALL-E-2-API` folder.

**If you're using Windows**, in the terminal, run

```bash
npx pkg DALL-E.js --targets latest-win-x64 -o DALL-E.exe
```

**If you're using Mac OS**, in the terminal, run

```bash
npx pkg DALL-E.js --targets latest-macos-x64 -o DALL-E
```

It will likely give you a warning along the lines of

```bash
> Warning Cannot include file %1 into executable.
  The file must be distributed with executable as %2.
  %1: node_modules\open\xdg-open
  %2: path-to-executable/xdg-open
```

Basically, pkg isn't able to bundle part of the `open` package (which lets me open urls in the browser) along with the executable. It's saying to include the missing part in the same directory as the executable. The file `xdg-open` is already included in this directory. You're welcome! :^)

Reopen the program where you change environment variables. In user variables, click on the variable titled 'Path', and press the `Edit...` button. On the right of the new window, press the `New` button. Set the value to the path to the `DALL-E-2-API` folder on your computer. This will allow you to run the executable from your terminal in any context.

Lastly, in the terminal, run

```bash
npm run deploy
```

This will make a website where you can view all the images you generate!

### Miscellaneous notes

`images.json` contains all the images I've generated myself. If you want those listed on your website, keep em. If not, get rid of em.
