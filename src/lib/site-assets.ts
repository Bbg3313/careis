import type { StaticImageData } from "next/image";

import homeSunHero from "@assets/c__Users_MSI_AppData_Roaming_Cursor_User_workspaceStorage_701d993c6b600915c5ecb074a55fb402_images_MAIN-fefa8caa-351a-4cc3-b9dc-a8dc5766216a.png";
import sunModelWarm from "@assets/c__Users_MSI_AppData_Roaming_Cursor_User_workspaceStorage_701d993c6b600915c5ecb074a55fb402_images_M5-b3778301-8348-4f04-842f-6d3e847115bc.png";
import sunTexture from "@assets/c__Users_MSI_AppData_Roaming_Cursor_User_workspaceStorage_701d993c6b600915c5ecb074a55fb402_images_____6-cfc6372e-b2be-4dbe-9cc7-f0f5cf698601.png";
import sunObject from "@assets/c__Users_MSI_AppData_Roaming_Cursor_User_workspaceStorage_701d993c6b600915c5ecb074a55fb402_images_____5-8849711a-846f-4bec-98e4-4a14ed9811c3.png";
import sunPackage from "@assets/c__Users_MSI_AppData_Roaming_Cursor_User_workspaceStorage_701d993c6b600915c5ecb074a55fb402_images_____1-77802c50-d27f-4653-ad1c-b096c42aaeb1.png";
import sunLifestyle from "@assets/c__Users_MSI_AppData_Roaming_Cursor_User_workspaceStorage_701d993c6b600915c5ecb074a55fb402_images____-7-5e14ceea-f6b3-4245-b0e4-dd3e99c0253e.png";

import illumHero from "@assets/c__Users_MSI_AppData_Roaming_Cursor_User_workspaceStorage_701d993c6b600915c5ecb074a55fb402_images________05-0a75cd12-874c-43de-8977-849a5dae998f.png";
import illumIce from "@assets/c__Users_MSI_AppData_Roaming_Cursor_User_workspaceStorage_701d993c6b600915c5ecb074a55fb402_images________08-7a789e26-bff7-41de-91f7-37c230b8a613.png";
import illumDark from "@assets/c__Users_MSI_AppData_Roaming_Cursor_User_workspaceStorage_701d993c6b600915c5ecb074a55fb402_images________10-e0fc6353-87aa-4582-b33e-7c9c7d2659db.png";
import illumModel from "@assets/c__Users_MSI_AppData_Roaming_Cursor_User_workspaceStorage_701d993c6b600915c5ecb074a55fb402_images________04-445c03ff-035a-42a6-9304-77b19e019054.png";
import illumPack from "@assets/c__Users_MSI_AppData_Roaming_Cursor_User_workspaceStorage_701d993c6b600915c5ecb074a55fb402_images_______-__-771d6d27-b9e3-4105-8741-c479c324aa78.png";

type ProductVisualSet = {
  hero: StaticImageData;
  gallery: StaticImageData[];
  card: StaticImageData;
  alt: string;
};

export const homeVisuals = {
  sunHero: homeSunHero,
  illuminatorHero: illumIce,
};

export const productVisuals: Record<"sun-pack" | "illuminator", ProductVisualSet> = {
  "sun-pack": {
    hero: homeSunHero,
    card: sunObject,
    alt: "심플스틱 선팩 제품 이미지",
    gallery: [sunObject, sunTexture, sunModelWarm, sunPackage, sunLifestyle],
  },
  illuminator: {
    hero: illumHero,
    card: illumModel,
    alt: "일루미네이터 시스테아민 5% 제품 이미지",
    gallery: [illumIce, illumDark, illumModel, illumPack, illumHero],
  },
};
