import { Share2, Trash2 } from "lucide-react"

export interface CardProp{
  title:string,
  link:string,
  type:"twitter"|"youtube"
}

export const Card = ({title,link,type}:CardProp) => {

  return (
    <>
    <div className="min-h-48 max-h-125 w-87.5 bg-white rounded-md shadow-md border border-gray-200 p-5 overflow-x-auto">
       <div className=" flex items-center justify-between">
       <div className=" flex items-center gap-2">
            <Share2 size={20} className="text-gray-400"/>
            <h1 className="font-semibold">{title}</h1>
       </div>
        <div className=" flex items-center gap-2">
            <Share2 size={20} className="text-gray-400" />
            <Trash2 size={20} className="text-gray-400" />
       </div>
       </div>

       <div  className="pt-4  ">

        {type==="youtube" && <iframe  className="w-full" src={link.replace("watch","embed").replace("?v=","/").split("&")[0]} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>}
   

         {type==='twitter' && <blockquote className="twitter-tweet w-full  h-4">
           <a className="h-2" href={link}></a>
       </blockquote>}
       </div>
    </div>
    </>
  )
}

