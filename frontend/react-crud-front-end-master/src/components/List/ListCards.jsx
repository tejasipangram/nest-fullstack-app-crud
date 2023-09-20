import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import EditList from "./EditList";
import { useContext, useState } from "react";
import { GlobalContext } from "../../GloblaCotext";

function ListCard({ title, description, id, filePath }) {
  const [showMore, setShowMore] = useState(false);
  const { deleteList, darkMode } = useContext(GlobalContext);
  const deleteHandler = () => {
    const confirm = window.confirm("Are you sure to delete");

    if (confirm) {
      deleteList(id);
    }
  };
  return (
    <Card
      className={`${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
      style={{ width: "25rem", marginTop: "1rem" }}
    >
      <Card.Img
        style={{ maxWidth: "100%", maxHeight: "200px" }}
        variant="top"
        src={process.env.REACT_APP_SERVER + "/static/" + filePath}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          {showMore ? (
            <div>
              {description}
              <a
                role="button"
                className="text-blue cursur-pointer mx-2"
                onClick={() => {
                  setShowMore(!showMore);
                }}
              >
                Hide
              </a>
            </div>
          ) : (
            <div>
              {description.slice(0, 50)}
              <a
                role="button"
                className="text-blue mx-2"
                onClick={() => {
                  setShowMore(!showMore);
                }}
              >
                More
              </a>
            </div>
          )}
        </Card.Text>
        <EditList
          id={id}
          title={title}
          description={description}
          filePath={filePath}
          name="EDIT"
        />

        <Button onClick={deleteHandler} className="m-2" variant="danger">
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ListCard;
