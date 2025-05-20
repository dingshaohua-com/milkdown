import Mitt from "mitt";

const emitter = Mitt<{
  selectionUpdated: {
    selection: Selection;
    prevSelection: Selection;
  };
}>();

export default emitter;