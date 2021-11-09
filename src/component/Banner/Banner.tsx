import React, {FC} from 'react';
import './Banner.css';

export const Banner: FC = (props) => {
  return (
    <div className="banner">
      {props.children}
    </div>
  );
}

export default Banner;