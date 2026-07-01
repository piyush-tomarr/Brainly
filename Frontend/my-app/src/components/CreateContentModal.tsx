import axios from "axios";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface contentModal {
  open: boolean;
  onclose: any;
}
interface SearchTag {
  id: number;
  name: string;
}
export default function CreateContentModal({ open, onclose }: contentModal) {
  const [tag, settag] = useState("");
  const [Tags, setTags] = useState<string[]>([]);
  const [searchResult, setsearchResult] = useState<SearchTag[]>([]);

  let searchTag = async () => {
    try {
      let res = await axios.get(
        `http://localhost:2020/api/v1/tags/search?q=${tag}`,
      );
      setsearchResult(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
   if(tag.trim().length<2){
    setsearchResult([])
    return;
   }

  let timeout = setTimeout(()=>{
    searchTag();
  },300)
  
  return ()=>clearTimeout(timeout)
    
  }, [tag]);


  const handleSetTags = () => {
    const trimmed = tag.trim()
    if(!trimmed)return
   let alreadyExist = Tags.some((t)=>t.toLocaleLowerCase()===trimmed.toLocaleLowerCase())
  if(alreadyExist){
    settag('')
    return;
  }
    setTags([...Tags, tag]);
    settag("");
  };
  const handleRemoveTag = (index: number) => {
    setTags(Tags.filter((_, i) => i !== index));
  };
  useEffect(() => {
    console.log(Tags);
  }, [Tags]);



 
  return (
    <>
      {open && (
        <div className="h-screen w-screen bg-black/40  fixed backdrop-blur-2xl flex justify-center items-center">
          <div className=" p-10 bg-white rounded-md relative">
            <div
              id="close"
              className="absolute top-2 right-2 cursor-pointer"
              onClick={onclose}
            >
              {" "}
              <X className="text-gray-400" />
            </div>
            <form action="" className="">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className=" outline-1 outline-gray-300 rounded-md px-3 py-1"
                  placeholder="Enter Title"
                />
                <input
                  type="text"
                  name="title"
                  id="title"
                  className=" outline-1 outline-gray-300 rounded-md px-3 py-1"
                  placeholder="Enter Link"
                />
              </div>

              <div className="p-2 mt-4 max-w-[50%] ">
                <div className=" flex gap-1 flex-wrap">
                  {Tags.map((e, index) => (
                    <div
                      key={index}
                      className="flex text-xs bg-blue-200 w-fit px-2 py-1 rounded-md text-blue-500 relative"
                    >
                      <span>#</span>
                      <p>{e}</p>
                      <div className="h-3 w-3 absolute -top-1 -right-1 bg-blue-400 rounded-full flex justify-center items-center">
                        <button
                          onClick={() => handleRemoveTag(index)}
                          type="button"
                          className=" cursor-pointer"
                        >
                          <X className="text-white" size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="  mt-1 flex items-center justify-between gap-2 relative">
                  <input
                    type="text"
                    name="tag"
                    id="tag"
                    value={tag}
                    onChange={(e) => {
                      settag(e.target.value);
                    }}
                    className=" outline-1 outline-gray-300 rounded-md px-3 py-1"
                    placeholder="Add HashTag"
                  />
                  <button
                    type="button"
                    onClick={handleSetTags}
                    className="bg-blue-300 flex items-center justify-center text-sm px-3 py-1 rounded-md"
                  >
                    <Plus size={14} /> Add
                  </button>
                  <div className="px-2 mb-0.5 h-auto  w-auto bg-black/30 backdrop-blur-xl absolute  bottom-full flex items-start justify-center flex-col">
                    {searchResult.map((e) => {
                      return (
                        <h1
                          key={e.id}
                        //   onClick={()=>{setTags([...Tags,e.name]); settag('')}}
                        onClick={()=>{
                            let alreadyExist = Tags.some((t)=>t.toLocaleLowerCase()===e.name.toLocaleLowerCase())
                            if(!alreadyExist){
                                setTags([...Tags,e.name ])
                            }
                            settag('');
                            
                        }}
                          className="px-2 py-1  my-1 w-full bg-white rounded-sm hover:bg-blue-300 cursor-pointer"
                        >
                          #{e.name}
                        </h1>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center ">
                <button className=" text-center px-4 py-1 bg-red-400 text-white font-semibold rounded-md m-5">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
