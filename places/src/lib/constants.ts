export const DEFAULT_SESSION_EXPIRE_IN_SECONDS = 60 * 60 * 24;
export function validateExpireVariable() {
    const expireIn = process.env.SESSION_EXPIRE_IN_SECONDS ?
        parseInt(process.env.SESSION_EXPIRE_IN_SECONDS, 10)
        : DEFAULT_SESSION_EXPIRE_IN_SECONDS;

    if (!Number.isInteger(expireIn) || expireIn < 0) {
        console.error(`SESSION_EXPIRE_IN_SECONDS was parsed into invalid value: ${expireIn}`);
        return DEFAULT_SESSION_EXPIRE_IN_SECONDS
    }

    return expireIn
}

export const SESSION_EXPIRE_IN_SECONDS = validateExpireVariable();
export const STATIC_IMG_ICON_PREFIX = process.env.NEXT_PUBLIC_STATIC_IMG_ICON_PREFIX ?? '';
export const S3_IMAGES_DIR = process.env.NEXT_PUBLIC_S3_IMAGES_DIR ?? '';