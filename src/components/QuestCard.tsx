import { Link } from 'react-router-dom';

interface QuestCardProps {
  title: string;
  image: string;
  link: string;
  alt: string;
}

const QuestCard = ({ title, image, link, alt }: QuestCardProps) => {
  return (
    <Link to={link} className="block mb-8 group">
      <div className="caution-border relative overflow-hidden rounded-lg transition-transform duration-300 transform group-hover:scale-105">
        <div className="h-64 relative overflow-hidden">
          <img 
            src={image} 
            alt={alt} 
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center">
            <h3 className="text-2xl font-bold text-yellow-DEFAULT p-4 tracking-wider">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuestCard;
