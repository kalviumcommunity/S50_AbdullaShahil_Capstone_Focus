import {
  ShimmerButton,
  ShimmerText,
  ShimmerCircularImage,
  ShimmerThumbnail,
  ShimmerBadge,
} from 'react-shimmer-effects';



// Post Shimmer 
export const PostShimmer = ({ scaleValue }) => (
  Array.from({ length: 10 }).map((_, index) => (
    <center key={index}>
      <div className={`posts border border-gray-300 rounded-md flex flex-col mb-10 p-5 w-[85vw] lg:w-[35vw] scale-[${scaleValue}] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]`}>
        <div className='flex justify-between items-center'>
          <div className="flex justify-between items-center">
            <ShimmerCircularImage size={50} />
            <div style={{ width: '10px' }}></div>
            <ShimmerBadge width={130} />
          </div>
          <ShimmerBadge width={70} />
        </div>
        <ShimmerThumbnail height={550} rounded />
        <div className="rounded p-2 flex items-center justify-between mt-1">
          <ShimmerBadge width={200} />
          <ShimmerButton size="md" />
        </div>
        <ShimmerText />
      </div>
    </center>
  ))
);



// Article Shimmer
export const ArticleShimmer = () => (
  Array.from({ length: 10 }).map((_, index) => (
    <div className='posts border border-gray-300 rounded-md flex flex-col mb-10 p-5 lg:w-[63vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]' key={index}>
      <div className='flex justify-between items-center'>
        <div className="flex justify-between items-center">
          <ShimmerCircularImage size={50} />
          <div style={{ width: '10px' }}></div>
          <ShimmerBadge width={130} />
        </div>
        <ShimmerBadge width={70} />
      </div>
      <ShimmerThumbnail height={550} rounded />
      <div className="rounded p-2 flex items-center justify-between mt-1">
        <ShimmerBadge width={200} />
        <ShimmerButton size="md" />
      </div>
      <ShimmerText />
    </div>
  ))
);
