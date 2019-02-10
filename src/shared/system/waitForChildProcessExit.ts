import childProcess from 'child_process';
export const waitForChildProcessExit = (proc: childProcess.ChildProcess) => new Promise(resolve => proc.addListener("exit", () => resolve()));
