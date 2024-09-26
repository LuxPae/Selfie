export default function ProfilePicture({ picture, alt}) {
  return <img className="bg-gray-400 text-black bg-gray-200 object-scale-down w-28 h-36 rounded" src={picture} alt={alt}/>
}
