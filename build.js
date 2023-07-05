// console.log(process.argv)

const { execSync } = require('child_process');

function getUnstagedFiles() {
    try {
        const output = execSync('git status --porcelain').toString();
        const lines = output.split('\n').map((line) => line.trim());
        console.log(lines);
        const unstagedFiles = lines.filter(
            (line) =>
                line.startsWith('M') ||
                line.startsWith('A') ||
                line.startsWith('D') ||
                line.startsWith('?')
        );
        const returnArr = unstagedFiles.map((file) => file.split(' ')[1]);
        console.log(unstagedFiles, returnArr);
        return returnArr;
    } catch (error) {
        console.error('Error executing git command:', error.message);
        return [];
    }
}

function getUnpushedBranches() {
    try {
        const output = execSync('git log --branches --not --remotes').toString();
        const lines = output.split('\n').map((line) => line.trim());
        const unpushedBranches = lines.filter((line) => line.startsWith('commit'));
        return unpushedBranches.map((branch) => branch.substring(7));
    } catch (error) {
        console.error('Error executing git command:', error.message);
        return [];
    }
}

const unstagedFiles = getUnstagedFiles();

if (unstagedFiles.length === 0) {
    console.log('No unstaged files.');
} else {
    console.error('Unstaged files:');
    // unstagedFiles.forEach((file) => console.log(file));
    console.log(unstagedFiles);
}

const unpushedBranches = getUnpushedBranches();

if (unpushedBranches.length === 0) {
    console.log('No unpushed branches.');
} else {
    console.error('Unpushed branches:');
    // unpushedBranches.forEach((branch) => console.log(branch));
    console.log(unpushedBranches);
}
