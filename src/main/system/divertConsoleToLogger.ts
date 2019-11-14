import { prepareErrorForSerialization } from '../../shared/proxy/prepareErrorForSerialization';
import { getLogger } from './getLogger';

const passwordRegex = new RegExp('password','i')
const passphraseRegex = new RegExp('passphrase','i')
const mnemonicRegex = new RegExp('mnemonic','i')

const tokenTester = (item: string) => (passwordRegex.test(item) || passphraseRegex.test(item) || mnemonicRegex.test(item))

export async function divertConsoleToLogger() {
  const logger = await getLogger()
  if (typeof logger === 'undefined') {
    return
  }
  const originalConsoleLog = console.log.bind(console);
  const originalConsoleWarn = console.warn.bind(console);
  const originalConsoleInfo = console.info.bind(console);
  const originalConsoleError = console.error.bind(console);
  console.log = (...args: any) => {
    const timestamp = new Date().toUTCString()
    let flag = false
    args.map((item:any) => {
      if (item && typeof item === 'string' && tokenTester(item))
        flag = true;
    })
    originalConsoleLog(...args);
    if(flag) return;
    logger.info(["Main console", timestamp, ...args]);
  };
  console.warn = (...args: any) => {
    const timestamp = new Date().toUTCString()
    let flag = false
    args.map((item:any) => {
      if (item && typeof item === 'string' && tokenTester(item))
        flag = true;
    })
    originalConsoleWarn(...args);
    if(flag) return;
    logger.warn(["Main console", timestamp, ...args]);
  };
  console.info = (...args: any) => {
    const timestamp = new Date().toUTCString()
    let flag = false
    args.map((item:any) => {
      if (item && typeof item === 'string' && tokenTester(item))
        flag = true;
    })
    originalConsoleInfo(...args);
    if(flag) return;
    logger.info(["Main console", timestamp, ...args]);
  };
  console.error = (...args: any) => {
    const timestamp = new Date().toUTCString()
    let flag = false
    args.map((item:any) => {
      if (item && typeof item === 'string' && tokenTester(item))
        flag = true;
    })
    originalConsoleError(...args);
    if(flag) return;
    logger.error(["Main console", timestamp, ...args]);
  };
  process.on('uncaughtException', (err) => {
    const e = prepareErrorForSerialization(err);
    logger.error("Main console", e);
    originalConsoleError(e);
  });
}
