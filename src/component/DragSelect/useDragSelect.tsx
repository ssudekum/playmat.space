import { MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Coordinate } from "../../lib/type/Spatial";
import { setIsDragging, setLocation, setOrigin } from "../../redux/actions";
import { RootState } from "../../redux";

const useDragSelect = (): [
  (event: MouseEvent) => void,
  (event: MouseEvent) => void,
] => {
  const dispatch = useDispatch();
  const isDragging = useSelector((state: RootState) => state.dragSelectReducer.isDragging);

  const onMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
      const coordinate: Coordinate = {
        x: event.pageX, 
        y: event.pageY,
      };

      dispatch(setIsDragging(true));
      dispatch(setOrigin(coordinate));
      dispatch(setLocation(coordinate));
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      dispatch(setLocation({
        x: event.pageX, 
        y: event.pageY,
      }));
    }
  };

  return [
    onMouseDown,
    onMouseMove,
  ];
};

export default useDragSelect;
