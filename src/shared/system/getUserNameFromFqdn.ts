export const getUserNameFromFqdn = (fqName: string) => {
    const r = /^(.*?)@/.exec(fqName);
    return r ? r[1] : null;
};
