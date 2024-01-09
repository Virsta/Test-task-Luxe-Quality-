import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { PhotoComponent } from "../../service/imgService";
import "../../styles/index.scss";

const CardForRent = ({ carData }) => {

  if (!carData) {
    return null;
  }

  return (
    <Box sx={{ position: "absolute", top: "50px", right: "100px" }}>
      <Card sx={{ width: 250, position: "relative", marginBottom: "10px" }}>
        <PhotoComponent imageName='crane-3.jpg' />
        <CardContent sx={{ padding: "10px" }}>
          <IconButton
            aria-label="add to favorites"
            disableRipple
            sx={{
              padding: "5px",
              background: "#fff",
              borderRadius: "10px",
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <FavoriteBorderIcon sx={{ color: "#000" }} />
          </IconButton>
          <Typography variant="h6" color="#000">
            {carData.title}
          </Typography>
          <Typography variant="subtitle1" color="#404b69">
            {carData.subtitle}
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Rating name="no-value" value={carData.rating} />
            <ChatOutlinedIcon sx={{ color: "#404B69" }} />
          </Box>
          <Typography variant="subtitle3" color="rgba(64,75,105,.6)">
            Мінімальна вартість
          </Typography>
          <Typography variant="h5" color="#000">
            {carData.minCost}
          </Typography>
          <Typography
            variant="subtitle1"
            color="#404b69"
            sx={{
              display: "flex",
              alignItems: "flex-start",
              marginTop: "10px",
            }}
          >
            <LocationOnOutlinedIcon />
            {carData.city}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CardForRent;
