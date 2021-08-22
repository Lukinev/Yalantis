import fs from "fs";
import Sharp from "sharp";

/** check email for valid
 * @param  {string} email user email for check
 * @returns boolean isValid or not
 */
export function validateEmail(email: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/** Crop and save profile Photo
 * @param  {Sharp.Sharp} img
 * @param  {string} fileName
 */
export function cropImage(img: Sharp.Sharp, fileName: string) {
  img.metadata().then(function (metadata: any) {
    img
      .extract({
        left: Math.round((metadata.width - 200) / 2),
        top: Math.round((metadata.height - 200) / 2),
        width: 200,
        height: 200,
      })
      .toFile(fileName);
  });
}
/** unlink photo file in img directory
 * @param  {string} photoName
 * @returns boolean
 */
export function unLinkPhoto(photoName: string): boolean {
  if (fs.existsSync("img/" + photoName)) {
    try {
      fs.unlinkSync("img/" + photoName);
      return true;
    } catch (err) {
      console.error(err);
    }
  }
  return false;
}
