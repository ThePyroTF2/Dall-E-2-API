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

git.commit('testing simple-git')