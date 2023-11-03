import { ImageBackground, Image } from 'react-native';
type Props = {
  index?: number;
  activeIndex?: number;
  imgPath: string;
};

const ImageSwiper = (props: Props) => {
  return <Image className="flex-1" source={{ uri: props.imgPath }} />;
};

export default ImageSwiper;
