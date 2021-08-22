import { Router } from "express";
import Busboy from "busboy";
import Sharp from "sharp";

import {
  deleteUserProfile,
  getUsersProfilesList,
  insUserProfile,
  IUserProfile,
  getUserProfile,
} from "./model";
import { cropImage, unLinkPhoto, validateEmail } from "./controller";

const api_router = Router();

api_router.post("/userProfile/", async (req: any, res: any) => {
  let profile = new Object() as IUserProfile;
  profile.$ID = new Date().getTime();

  const busboy = new Busboy({ headers: req.headers });
  busboy.on(
    "file",
    async function (fieldname, file, filename, encoding, mimetype) {
      const fileSaveName =
        profile.$ID +
        "." +
        filename
          .split("")
          .reverse()
          .join("")
          .split(".")[0]
          .split("")
          .reverse()
          .join("");

      profile.$PHOTO = fileSaveName;

      const ws = Sharp();
      file.pipe(ws);
      cropImage(ws, "img/" + fileSaveName);
    }
  );

  busboy.on(
    "field",
    function (
      fieldname,
      val,
      fieldnameTruncated,
      valTruncated,
      encoding,
      mimetype
    ) {
      //if field EMAIL then check for valid
      if (fieldname.toUpperCase() === "EMAIL") {
        (profile as any)[`$${fieldname.toUpperCase()}`] = validateEmail(val)
          ? val
          : "";
      } else {
        if (val !== "") {
          (profile as any)[`$${fieldname.toUpperCase()}`] = val;
        } else profile.$EMAIL = "";
      }
    }
  );

  busboy.on("finish", async function () {
    if (profile.$EMAIL !== "") {
      await insUserProfile(profile);
      res.status(201).json(profile);
    } else res.status(400).send("Not valid EMAIL or any field is empty");
  });

  req.pipe(busboy);
});

api_router.delete("/userProfile/:ID", async (req: any, res: any) => {
  let id = parseInt(req.params.ID);

  if (id > 0) {
    let result: any[] = (await getUserProfile(id)) as any[];
    const fileName: any = result[0].PHOTO;
    unLinkPhoto(fileName);
    await deleteUserProfile(id);
  }
  res.status(200).json(0);
});

api_router.get("/userProfile/", async (req: any, res: any) => {
  let result = await getUsersProfilesList();

  res.status(200).json(result);
});

api_router.get("/*", async (req: any, res: any) => {
  res.send("wrong path");
});

export = api_router;
