
import { Card } from "../components/Card"

export default function Home(){
  return (
    <>
    <div className="min-h-screen w-full bg-gray-200 flex-wrap flex gap-5 p-4">

      <Card type={'youtube'}  title={"Prakhar's Podcast about ai"}  link={"https://www.youtube.com/watch?v=Zmz5gE9nJqY"}/>
      <Card type={'twitter'}  title={"Harkirat Bhai ka tweet"}  link={"https://x.com/nick_realm_01/status/2063136718849790375?s=20"}/>
  </div>
    </>
  )
}