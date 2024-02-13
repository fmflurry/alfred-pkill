'use strict';
import fkill from 'fkill'

// check whether we want to force kill process
const force = !!process.env.forceKill;
fkill(parseInt(process.argv[2], 10), { force });

