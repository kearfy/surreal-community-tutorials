import fs from 'fs';

const guideIntroTemplate = fs.readFileSync('./theme/guideIntro.html').toString();
function FillGuideIntro(g) {
    let tmpl = guideIntroTemplate;
    tmpl = tmpl.replace('{{TITLE}}', g.title);
    tmpl = tmpl.replace('{{CREATOR}}', g.creator);
    tmpl = tmpl.replace('{{LINK}}', g.link);
    return tmpl;
}

function CollectFolderGuides(folder) {
    let guides = [];
    const matchOptions = /^---\ntitle: (.*)\ncreator: (.*)\nlink: (.*)\n---$/m;
    const files = fs.readdirSync(`./${folder}/`).filter(f => !f.startsWith('00-'));
    files.forEach(f => {
        const path = `./${folder}/${f}`;
        const content = fs.readFileSync(path).toString();
        const matchedOptions = content.match(matchOptions);
        if (!matchedOptions) {
            console.error("Guide has invalid config options");
            console.error(`  - ${f}`);
            process.kill(1);
        }

        const guide = {
            title: matchedOptions[1],
            creator: matchedOptions[2],
            link: matchedOptions[3]
        };

        guides.push(guide);
        fs.writeFileSync(path, content.replace(matchedOptions[0], FillGuideIntro(guide)))
    });

    console.log(JSON.stringify(guides, null, 2));
}   

CollectFolderGuides('community')
