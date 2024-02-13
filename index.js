'use strict'
import alfy from 'alfy';
import psList from 'ps-list';

// load running process and filter them based on input
const getProcessCollection = async () => {
    // TODO: add feature to kill process
    return psList().then(processCollection => {
        const regExp = new RegExp(alfy.input, 'gi'); // input case-insensitive
        return processCollection.filter(p => p.name.match(regExp));
    });
};

const sanitizePath = processCmd => processCmd.replace(/\.app\/Contents\/.*$/, '.app');
const getIconPath = sanitizedPath => sanitizedPath.replace(/ -.*/, '');


// filter process so we can chose which one we want to kill
getProcessCollection().then(processCollection => {
    const prettyProcessCollection = processCollection
        .filter(p => !p.name.endsWith(' Helper'))
        .map(p => {
            const sanitizedPath = sanitizePath(p.cmd);  
            const iconPath = getIconPath(sanitizedPath);

            const subtitle = !!p.port
                ?  `${process.port} - ${subtitle}`
                : sanitizedPath;

            return {
                title: p.name,
                autocomplete: p.name,
                subtitle,
                arg: p.pid,
                icon: {
                    type: 'fileicon',
                    path: iconPath
                },
                mods: {
                    shift: {
                        subtitle: `CPU usage: ${p.cpu}%`
                    },
                    alt: {
                        subtitle: `/!\\ Force Kill /!\\`,
                        arg: JSON.stringify({
                            alfredworkflow: {
                                arg: p.pid,
                                variables: {
                                    forceKill: true
                                }
                            }
                        })
                    }
                }
            };
        });

    // TODO : find a smart wway to sort

    alfy.output(prettyProcessCollection);
});



