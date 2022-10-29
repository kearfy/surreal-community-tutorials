import fs from 'fs';

function CollectFolderGuides(folder) {
    let guides = [];
    const matchOptions = /^---\ntitle: (.*)\ncreator: (.*)\nlink: (.*)\n---$/m;
    const files = fs.readdirSync(`./${folder}/`).filter(f => !f.startsWith('00-'));
    files.forEach(f => {
        const content = fs.readFileSync(`./${folder}/${f}`).toString();
        const matchedOptions = content.match(matchOptions);
        if (!matchedOptions) {
            console.error("Guide has invalid config options");
            console.error(`  - ${f}`);
            process.kill(1);
        }

        guides.push({
            title: matchedOptions[1],
            creator: matchedOptions[2],
            link: matchedOptions[3]
        });
    });

    console.log(JSON.stringify(guides, null, 2));
}   

CollectFolderGuides('community')
