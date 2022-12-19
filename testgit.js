const simpleGit = require('simple-git')
simpleGit().clean(simpleGit.CleanOptions.FORCE)

const options = {
    baseDir: process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
};

// when setting all options in a single object
const git = simpleGit(options);
const main = async () => {
    await git.add('testgit.js')
    await git.commit('test')
    await git.push('main')
}

main()