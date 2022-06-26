import { contextBridge } from "electron"
import { LOCAL_FOLDER_PATH } from "./constants"
import { Photo } from "./photo"
import fs from "fs"
import path from "path"

contextBridge.exposeInMainWorld("api", { getLocalPhotos })

function getLocalPhotos(): Photo[]
{
   
   let folderPath = LOCAL_FOLDER_PATH
   let fileNames:String[]=[]
   function traverseDir(dir:String) {   
      fs.readdirSync(dir.toString()).forEach(file => {
        let fullPath = path.join(dir.toString(), file)
        if (fs.lstatSync(fullPath).isDirectory()) {
           traverseDir(fullPath)
         } else {
            fileNames.push(fullPath)
         }  
      })
   }
   traverseDir(folderPath)

   const photos = fileNames.slice()
      .filter(fn => fn.match(/\.(jpg|jpeg)$/i) != null)
      .map(fn => ({
         url: `file:///${fn.replaceAll("\\", "/")}`,
         title: "",
         attribution: "",
      }))

   return photos
}


