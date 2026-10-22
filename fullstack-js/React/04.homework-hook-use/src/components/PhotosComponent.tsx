import { use } from "react";

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface PhotosProps {
  photosPromise: Promise<Photo[]>;
}

function PhotosComponent({ photosPromise }: PhotosProps) {
  const photos = use(photosPromise);

  return (
    <ul
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "5px",
        listStyle: "none",
        paddingLeft: 0,
      }}
    >
      {photos.slice(0, 10).map(({ id, thumbnailUrl, title }) => {
        return (
          <li key={id}>
            <img
              src={thumbnailUrl}
              alt={title}
              width={150}
              height={150}
              style={{ display: "block" }}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default PhotosComponent;
