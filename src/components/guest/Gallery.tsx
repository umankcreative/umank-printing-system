import { useState, useMemo } from 'react';
import { Photo } from '../../data/mockData';
import { PhotoCard } from './Gallery/PhotoCard';
import { CategoryFilter } from './Gallery/CategoryFilter';
import { Lightbox } from './Gallery/Lightbox';

 export const photos: Photo[] = [
  {
    "id": 1,
    "title": "Yasin Soft Cover 1",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2023/04/fb21010c-71bf-492b-be5a-c077994c68b7-576x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 2,
    "title": "Yasin Soft Cover 2",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/A99FD56E-DD8F-4B59-B5E4-BDAC3F6AB1D8-1024x768.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 3,
    "title": "Yasin Soft Cover 3",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/90D8428F-B7A0-441B-BDD8-F6160275CACB-768x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 4,
    "title": "Yasin Soft Cover 4",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/6CD46D69-BF92-4E62-B06A-C4CC992E410C-768x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 5,
    "title": "Yasin Soft Cover 5",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/B141CA3D-75EE-4DCD-9EB0-AC8DBFF476C5-768x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 6,
    "title": "Yasin Soft Cover 6",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/82DBB294-03B3-40B4-A177-2E77BCEBF2CD-819x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 7,
    "title": "Yasin Soft Cover 7",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/64138009-6BEB-499C-948C-6E945BA6285C-768x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 8,
    "title": "Yasin Soft Cover 8",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/4E653330-9BB5-4E3A-AA28-DBBA53CC1254-768x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 9,
    "title": "Yasin Soft Cover 9",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/CCD2EDBE-02C1-4837-A115-1897499E7219-1024x580.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 10,
    "title": "Yasin Soft Cover 10",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/8A0DBFD0-BBCC-45A8-948D-FFE7C543ED31.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 11,
    "title": "Yasin Soft Cover 11",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/AFC0AB37-8BC2-47B3-B33C-A3ED1E774B3B.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 12,
    "title": "Yasin Soft Cover 12",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/EB30F4C0-C659-418D-9CFC-1D42F519BF6B-1024x768.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 13,
    "title": "Yasin Soft Cover 13",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/5E93413F-4EC0-42B8-AE0D-3820AA61544F.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 14,
    "title": "Yasin Soft Cover 14",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/3EA9ED7F-1D92-430E-8C50-FB12EDC1FE8C.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 15,
    "title": "Yasin Soft Cover 15",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/1FC16DF5-5021-46CE-8A95-33659A1A8005-885x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 16,
    "title": "Yasin Soft Cover 16",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/3F43767A-C9C8-4ACC-8A56-27486CA5387A-920x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 17,
    "title": "Yasin Soft Cover 17",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/98D8E5ED-454B-436B-9150-762AD40F3DB4-928x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 18,
    "title": "Yasin Soft Cover 18",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/FC5E676E-1326-4030-8469-0FAF692C32A5-768x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 19,
    "title": "Yasin Soft Cover 19",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/AAF362CE-F9D8-4645-8258-4761668F4BE8-1024x768.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 20,
    "title": "Yasin Soft Cover 20",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/752898C7-B2FC-4C88-8E8B-E4A0DAF4D1AC-768x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 21,
    "title": "Yasin Soft Cover 21",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/EAF88FE5-60B1-4E6E-A237-1EBB7A7D6041-1024x887.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 22,
    "title": "Yasin Soft Cover 22",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/A683F442-4DBB-4A41-9BBF-FA8BE2F7537A-768x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 23,
    "title": "Yasin Soft Cover 23",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/D0704F5F-237B-4095-9D20-70154A9D03A6-1024x768.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 24,
    "title": "Yasin Soft Cover 24",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/EE1D200A-72EA-4CEC-9E62-FF53C64A6521-1024x838.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 25,
    "title": "Yasin Soft Cover 25",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/9DC7E428-BBF3-4CBD-9B63-FC136D9F26E1-819x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 26,
    "title": "Yasin Soft Cover 26",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/331EF938-7A6C-4BC6-8921-D3F0B943F582-1024x768.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 27,
    "title": "Yasin Soft Cover 27",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/6DCEF490-258D-4493-B241-B60697BA4CB8-1024x768.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 28,
    "title": "Yasin Soft Cover 28",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/12BFCD1E-BC49-49D0-A5EF-D93EA7132551-1024x768.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 29,
    "title": "Yasin Soft Cover 29",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/559305A9-0FD9-4DB4-AD23-C687DF4560B4-1024x576.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 30,
    "title": "Yasin Soft Cover 30",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/1DAF2A47-23E5-4E12-8C28-F5A3CCA6EB8B-1024x576.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 31,
    "title": "Yasin Soft Cover 31",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/C8991238-F4E1-479D-A880-EDB673622CC1.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 32,
    "title": "Yasin Soft Cover 32",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/C85D8035-ABD8-4A62-9B89-C57649C1427A-1024x768.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 33,
    "title": "Yasin Soft Cover 33",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/5A15D0F6-8E8E-4CE9-99AE-8BC12833BD1D-1024x768.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 34,
    "title": "Yasin Soft Cover 34",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/F58C30FA-4692-4108-B281-B0AFF53F37F3-1024x895.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 35,
    "title": "Yasin Soft Cover 35",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/1237FF12-C033-49FF-96D4-60A90912BB76-1024x703.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 36,
    "title": "Yasin Soft Cover 36",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/78FBB14E-3E24-4B4E-ACE2-370F9E93ACC0-1024x576.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 37,
    "title": "Yasin Soft Cover 37",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/66C12E73-DDD4-40F3-A416-E5CB62741BF5-1024x768.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 38,
    "title": "Yasin Soft Cover 38",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/CA9FBBB9-9E0C-4C52-8C94-FA62906229D9-768x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 39,
    "title": "Yasin Soft Cover 39",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/0EDF6B74-8BF9-4925-A76E-B4FA957BE802-1024x768.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 40,
    "title": "Yasin Soft Cover 40",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/A533B4EA-E854-45A8-ABA5-0F2E7B9AE167-1024x768.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 41,
    "title": "Yasin Soft Cover 41",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/B85DCDEB-894E-4746-905C-C834225AE895-768x1024.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 42,
    "title": "Yasin Soft Cover 42",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/6E0A9320-7807-4E88-AF29-A4F22A3C85B3-1024x768.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 43,
    "title": "Yasin Soft Cover 43",
    "category": "yasin-soft-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/D9D20128-38FA-46B4-A957-7B557A0F2711.jpeg",
    "description": "Image of Yasin Soft Cover"
  },
  {
    "id": 44,
    "title": "Yasin Hard Cover 1",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2024/09/PHOTO-2024-09-04-18-14-47-10-1024x576.jpg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 45,
    "title": "Yasin Hard Cover 2",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2024/09/ab-Sedang.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 46,
    "title": "Yasin Hard Cover 3",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2024/09/aa-1024x768.jpg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 47,
    "title": "Yasin Hard Cover 4",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2023/04/11a449c7-dd6d-4ff0-8721-72659e2596b8-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 48,
    "title": "Yasin Hard Cover 5",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2023/04/8049e314-1d52-4e23-ab70-5b848c1a991c-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 49,
    "title": "Yasin Hard Cover 6",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2023/04/c82c5f09-d0f8-4dbf-aa76-83f5d9e68ec9-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 50,
    "title": "Yasin Hard Cover 7",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2023/04/aa8101d3-fc6d-4984-ab4d-9827f7816eff-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 51,
    "title": "Yasin Hard Cover 8",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2023/04/49726f20-e55d-44f0-9d75-9c7beebd2882-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 52,
    "title": "Yasin Hard Cover 9",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2023/04/59510DA1-13D1-4EB5-A42F-868A44056703-819x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 53,
    "title": "Yasin Hard Cover 10",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2023/04/3b32e5ad-48a9-4ad1-90f6-4c8cb7a8ea17-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 54,
    "title": "Yasin Hard Cover 11",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2023/04/271e6f56-4a7b-45a0-a3ba-0d0fd972a178-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 55,
    "title": "Yasin Hard Cover 12",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/223A433A-7C3E-473E-8606-102AD1A87BDC-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 56,
    "title": "Yasin Hard Cover 13",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/779CD726-3D25-4C33-8ACA-6FCFDD9FC3F8-1024x768.jpeg",

    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 57,
    "title": "Yasin Hard Cover 14",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/B9BADE25-5A75-4499-8FE4-40A79E95FB77-scaled-e1680196602901-1024x768.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 58,
    "title": "Yasin Hard Cover 15",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/0882B0D6-3991-4C17-8BC0-BDDBD10BD900-1024x768.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 59,
    "title": "Yasin Hard Cover 16",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/26D048FD-5714-4D0C-B4F4-84AA8BFEBFFE-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 60,
    "title": "Yasin Hard Cover 17",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/415A9418-1EC3-4D47-A90A-6E37F5AB5D7C-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 61,
    "title": "Yasin Hard Cover 18",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/C882DA1A-D446-4DA3-BB88-60FF7BD5E518.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 62,
    "title": "Yasin Hard Cover 19",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/91B33766-9C8D-4393-9DF4-95224513A850.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 63,
    "title": "Yasin Hard Cover 20",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/43404F13-7D2A-4D01-B91F-716D9208D279.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 64,
    "title": "Yasin Hard Cover 21",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/D27CCBC2-366B-408C-A2BF-D10497AF73B0-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 65,
    "title": "Yasin Hard Cover 22",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/7E51CA56-4757-4B86-93F5-9A74529CC8B6.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 66,
    "title": "Yasin Hard Cover 23",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/8EB0A5C7-4FCC-41F2-A7CC-842E4E39B42A.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 67,
    "title": "Yasin Hard Cover 24",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/9ABFF673-3F9A-4974-B2BE-6D997D1FD3E1.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 68,
    "title": "Yasin Hard Cover 25",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/539D2CF4-0BB6-4E27-9B85-DB964D9D2E5F.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 69,
    "title": "Yasin Hard Cover 26",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/D28527E1-4FB5-4247-ADD5-D0CB86846D42.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 70,
    "title": "Yasin Hard Cover 27",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/D272E1F3-B20A-464D-BCB2-4DAD3B95432C.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 71,
    "title": "Yasin Hard Cover 28",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/5DA5E250-3907-4286-B1B4-8DCBE99A13BE.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 72,
    "title": "Yasin Hard Cover 29",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/6AA0E4BC-1DAD-4E0B-9064-4B3E5B5BF253.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 73,
    "title": "Yasin Hard Cover 30",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/BB2296B4-115A-491A-94D8-5C5E57F76D88-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 74,
    "title": "Yasin Hard Cover 31",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/0B184A2B-CCF9-4FD7-A725-2363C70B3A34-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 75,
    "title": "Yasin Hard Cover 32",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/28816BCE-6CA5-4598-8DFF-CE9598AF03EA-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 76,
    "title": "Yasin Hard Cover 33",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/EE6FFFBE-397A-4A7E-9410-D02DE0F81F39-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 77,
    "title": "Yasin Hard Cover 34",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/392C16F9-BF96-4EEC-A595-E09D243F1094.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 78,
    "title": "Yasin Hard Cover 35",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/1321ADA3-6CA9-4115-B280-B5D3A4BBBE42-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 79,
    "title": "Yasin Hard Cover 36",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/0AB23EF3-3242-42A6-A5F4-F68010496B1A-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 80,
    "title": "Yasin Hard Cover 37",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/776A7656-7CEB-400F-A45B-864A7882E089-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 81,
    "title": "Yasin Hard Cover 38",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/FCBA718E-D726-4249-BA01-7A09D33DB985-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 82,
    "title": "Yasin Hard Cover 39",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/CAE09649-FC75-4AE5-8418-184E0D9F49E9-819x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 83,
    "title": "Yasin Hard Cover 40",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/7D17663E-3DE7-48A3-8502-FD8C5D58FB45-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 84,
    "title": "Yasin Hard Cover 41",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/95780C44-D407-428E-AF98-CE664967C360-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 85,
    "title": "Yasin Hard Cover 42",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/EC89FE9D-5C5B-4293-8ABD-51CF5E3C3021.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 86,
    "title": "Yasin Hard Cover 43",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/5F5DFD6F-7391-4F9E-A80F-50EB5414D2C2-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 87,
    "title": "Yasin Hard Cover 44",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/BEB7A79A-01A5-4CAA-BFAC-4CC6FD9BE1C2-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 88,
    "title": "Yasin Hard Cover 45",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/921BD592-50F9-439B-A560-89CC924238F5-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 89,
    "title": "Yasin Hard Cover 46",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/F5A3A504-B7C1-4553-8B0B-BE8822506E4E-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 90,
    "title": "Yasin Hard Cover 47",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/38DD3167-109E-4BB8-A7EE-C9D51CABEF9A-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 91,
    "title": "Yasin Hard Cover 48",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/EC40D815-85E7-41FC-9532-71A5973E4DEA-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 92,
    "title": "Yasin Hard Cover 49",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/CE8AF7CB-C944-4989-A949-161BE0F2D40D-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 93,
    "title": "Yasin Hard Cover 50",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/DCC9FC91-258D-4C30-9C46-ED4C3313A074-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 94,
    "title": "Yasin Hard Cover 51",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/2EB8C718-2BEA-4BDF-AED7-EFF1A65A4D1B-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 95,
    "title": "Yasin Hard Cover 52",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/129803B9-2CED-4B83-90A7-6B5B1B4A6586-576x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 96,
    "title": "Yasin Hard Cover 53",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/368485F8-C21F-411D-B8AE-E01D495EC463.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 97,
    "title": "Yasin Hard Cover 54",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/C974863C-2C7B-4E87-9647-673F5E4B385B-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 98,
    "title": "Yasin Hard Cover 55",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/4D38EACE-47B9-4C8E-B92F-E1E24504E68F.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 99,
    "title": "Yasin Hard Cover 56",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/A0D0F9BA-9C46-421C-9069-5767ADF5C2AB-1024x768.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 100,
    "title": "Yasin Hard Cover 57",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/58F65044-95AE-437B-B020-6FC826F40CEB-576x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 101,
    "title": "Yasin Hard Cover 58",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/13AA9FDD-A63D-4F62-A007-6BC083084224-1024x768.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 102,
    "title": "Yasin Hard Cover 59",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/315D704F-79ED-4992-AE75-6117A3198113-1024x768.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 103,
    "title": "Yasin Hard Cover 60",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/70DCACDD-0034-4779-94E0-8048E5BA0770-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 104,
    "title": "Yasin Hard Cover 61",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/2ED78C66-2272-42AE-BB39-A1679E48CED3.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 105,
    "title": "Yasin Hard Cover 62",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/12C0E101-BE27-40D5-A51D-91B59E04A301-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 106,
    "title": "Yasin Hard Cover 63",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/BD9DF5B5-2B3A-4603-B713-0B13DFE90E6F-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 107,
    "title": "Yasin Hard Cover 64",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/FEBDF767-706E-4963-BE63-AF043F2AA639-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 108,
    "title": "Yasin Hard Cover 65",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/6C5A04FA-D0CB-4BBE-BD1A-A8B7F40C4E3E-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 109,
    "title": "Yasin Hard Cover 66",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/59109698-9B9D-47CD-9201-C1684B347173-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 110,
    "title": "Yasin Hard Cover 67",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/44C22D27-0C48-4677-A9B8-DDED6180E325-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 111,
    "title": "Yasin Hard Cover 68",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/746869C5-2D87-4399-AB75-1AB2BB31CD26-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 112,
    "title": "Yasin Hard Cover 69",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/EBBB1171-4DD2-4562-9DED-4D9CB33ABCDD-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 113,
    "title": "Yasin Hard Cover 70",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/BD87550E-3637-42E0-8A4C-5685B53FAE18-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 114,
    "title": "Yasin Hard Cover 71",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/ED4CEBB8-F8C0-4489-A86F-CA751C427B8C.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 115,
    "title": "Yasin Hard Cover 72",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/357DC827-3F9E-4642-80AB-360AD12CDAB8.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 116,
    "title": "Yasin Hard Cover 73",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/9E21B0F0-40E0-450E-8B59-231BDF88F6DE-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 117,
    "title": "Yasin Hard Cover 74",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/29CD1BE8-AD2B-467D-A7ED-0A9445514836-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 118,
    "title": "Yasin Hard Cover 75",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/0FFF8DC4-DED6-41CF-89C1-2C66BD2B4135-576x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 119,
    "title": "Yasin Hard Cover 76",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/C3A829BC-E6C4-4C9A-BB74-CA7E79FE1903.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 120,
    "title": "Yasin Hard Cover 77",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/2E43D646-D29B-4A45-841D-33C0D18FA2D6.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 121,
    "title": "Yasin Hard Cover 78",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/0D9/A4A1081C-513E-4697-BB2F-AE775DD6EA05-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 122,
    "title": "Yasin Hard Cover 79",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/FBFEB072-2571-4B81-B026-30EF79ED86A6-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 123,
    "title": "Yasin Hard Cover 80",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/C122A5CD-C518-4BA3-BE10-0B7283DEE893.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 124,
    "title": "Yasin Hard Cover 81",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/9D82695F-E66E-46D3-947A-FECFEF753615.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 125,
    "title": "Yasin Hard Cover 82",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/9F7FF9A0-21A0-4ECE-84C2-4C76B99CDBA3.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 126,
    "title": "Yasin Hard Cover 83",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/1B89C1A2-5253-46DF-B1D6-84CFABAE6692-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 127,
    "title": "Yasin Hard Cover 84",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/DC4AD62A-97E0-4AE4-B70F-D70A668FDD98-576x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 128,
    "title": "Yasin Hard Cover 85",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/4CE303C9-C5C5-4F56-8D92-52061E07DBAB-1024x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 129,
    "title": "Yasin Hard Cover 86",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/6FF03337-1D30-409C-9FD2-672C2B5CD4F3-1024x768.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 130,
    "title": "Yasin Hard Cover 87",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/08387B60-D019-4F74-AD7F-A49D9206B1D9.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 131,
    "title": "Yasin Hard Cover 88",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/AA9A819A-1785-4CEB-9500-AF3AFC739C8B-576x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 132,
    "title": "Yasin Hard Cover 89",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/F9AB7225-D5B1-4534-B9A6-B456F7E4339C-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 133,
    "title": "Yasin Hard Cover 90",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/AAA7F3CF-0377-4C85-94F3-3F5BB3072E9F.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 134,
    "title": "Yasin Hard Cover 91",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/817C561E-E99E-42D9-B3B4-C8F9CDBBEDEF-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 135,
    "title": "Yasin Hard Cover 92",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/00346FE4-9C0D-4537-B1D4-46A2F9EF6C90.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 136,
    "title": "Yasin Hard Cover 93",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/27AB3269-CCD7-4CEA-92D9-F1A88566D42A-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 137,
    "title": "Yasin Hard Cover 94",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/606106DA-82FA-4025-BD8E-C34FEECB96C1-1024x768.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 138,
    "title": "Yasin Hard Cover 95",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/F7BD82EA-1AEE-4194-AA01-B0A279D632E2-768x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 139,
    "title": "Yasin Hard Cover 96",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/CBD461CF-3074-4B01-AB95-CD965FEA865D-1024x768.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 140,
    "title": "Yasin Hard Cover 97",
    "category": "yasin-hard-cover",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/51B6C181-B597-4F33-9EE7-1721B731B48B-576x1024.jpeg",
    "description": "Image of Yasin Hard Cover"
  },
  {
    "id": 141,
    "title": "Plakat 1",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/e5b7af43-2d2c-4765-8033-5dbe66c30dca-1024x576.jpg",
    "description": "Image of Plakat"
  },
  {
    "id": 142,
    "title": "Plakat 2",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2023/05/IMG_3328-1024x576.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 143,
    "title": "Plakat 3",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/plakat-coalindo-group-1024x768.jpg",
    "description": "Image of Plakat"
  },
  {
    "id": 144,
    "title": "Plakat 4",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/D81A1EC1-A54B-4A46-8D8D-B1263BD3853F-768x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 145,
    "title": "Plakat 5",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/IMG_1376-1024x768.jpg",
    "description": "Image of Plakat"
  },
  {
    "id": 146,
    "title": "Plakat 6",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/D59BB566-65A4-4750-8EB0-725FA7F65E26-819x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 147,
    "title": "Plakat 7",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/CCD959B9-1192-402F-A009-B49558CE10FA-768x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 148,
    "title": "Plakat 8",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/7FD433C2-98B5-4F24-B062-61501B8C9C5D.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 149,
    "title": "Plakat 9",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2023/03/e165b8e0-2751-4ec8-9ed8-1d44d64b3fbb-768x1024.jpg",
    "description": "Image of Plakat"
  },
  {
    "id": 150,
    "title": "Plakat 10",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/D1F099A8-BBAF-4F0C-A583-433BCFA9AB4D-768x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 151,
    "title": "Plakat 11",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/ECAA1BD4-FB17-4FC2-AA08-18C9AA32859C-768x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 152,
    "title": "Plakat 12",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/C9ECCC51-79A0-43A8-B3B2-D839DDE8BC1B-768x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 153,
    "title": "Plakat 13",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/E38B0BF0-DF70-4513-B12C-87E7DCF78209-768x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 154,
    "title": "Plakat 14",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/198CB142-AE23-4540-A4A8-23E6E77DC6FD-768x1o24.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 155,
    "title": "Plakat 15",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/C7F71E9A-44BA-4BA4-B379-BABDCEDD0028-1024x768.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 156,
    "title": "Plakat 16",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/84D733BB-48F8-41DC-B225-346C25A157F1-576x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 157,
    "title": "Plakat 17",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/4AC242D5-E6CD-4EC1-A860-C20B993C994F-768x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 158,
    "title": "Plakat 18",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/B4C88BCD-0DA4-4F26-AF88-A7C49F3B453A-768x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 159,
    "title": "Plakat 19",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/ECAB4E61-D330-48B6-8EC9-73FB5AEFB599-768x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 160,
    "title": "Plakat 20",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/7E680935-9CEA-4E9A-92AE-2FEEEC9C5C5F-768x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 161,
    "title": "Plakat 21",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/D1DD355B-15C1-4557-B9C9-B1D5B20C20B7-768x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 162,
    "title": "Plakat 22",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/29391354-DF3C-4A1A-B34B-6C971DA04368-576x1024.jpeg",
    "description": "Image of Plakat"
  },
  {
    "id": 163,
    "title": "Plakat 23",
    "category": "plakat",
    "imageUrl": "https://umank.com/wp-content/uploads/2022/09/E0769EAE-B179-4064-8A85-B223D4C7D5EC-768x1024.jpeg",
    "description": "Image of Plakat"
  }
];

export const categories = [
  { id: 'all', name: 'Semua', count: 0 },
  { id: 'yasin-soft-cover', name: 'Yasin Soft Cover', count: 0 },
  { id: 'yasin-hard-cover', name: 'Yasin Hard Cover', count: 0 },
  { id: 'plakat', name: 'Plakat', count: 0 }
];
// Update count for categories
categories.forEach(category => {
  if (category.id === 'all') {
    category.count = photos.length;
  } else {
    category.count = photos.filter(photo => photo.category === category.id).length;
  }
});

export const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'all') {
      return photos;
    }
    return photos.filter(photo => photo.category === activeCategory);
  }, [activeCategory]);

  const openLightbox = (photoIndex: number) => {
    setCurrentPhotoIndex(photoIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateInLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Gallery Foto
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Jelajahi koleksi foto yang menakjubkan dari berbagai kategori. 
            Klik pada foto untuk melihat dalam mode slideshow.
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold mb-2">Tidak ada foto ditemukan</h3>
            <p className="text-muted-foreground">
              Coba pilih kategori lain untuk melihat foto-foto yang tersedia.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        photos={filteredPhotos}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNavigate={navigateInLightbox}
      />
    </div>
  );
};
