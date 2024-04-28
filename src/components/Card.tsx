"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import {
  Alert,
  Button,
  CardActionArea,
  CardActions,
  Snackbar,
  SnackbarOrigin,
} from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import BookImg from "../../assets/book-img.png";
import { getLocalStorage } from "@/app/utils";
import { IEntityBooks } from "@/app/services/collection/book/IEntityBooks";
import { ObjectId } from "mongodb";
import { IReqAuth } from "@/app/services/collection/auth/IEntityAuth";
import { yellow } from "@mui/material/colors";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
type IBookCardProps = {
  id?: string;
  bookName: string;
  bookDescription: string;
  aldyBorrowed: string;
  user: string;
  callApi: React.Dispatch<React.SetStateAction<boolean>>;
  borrowAmount: number;
};
interface State extends SnackbarOrigin {
  open: boolean;
}
export default function BookCard(props: IBookCardProps) {
  const { id, bookName, callApi,borrowAmount, user, bookDescription, aldyBorrowed } = props;
  const [opens, setOpen] = React.useState(false);
  const [from, setFrom] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleFrom = (from: boolean) => setFrom(from);
  const [open, setOpens] = React.useState(false);
  const handleSubmit = async () => {
    setOpens(true);
    const obj: IEntityBooks = {
      bookName: bookName,
      bookDescription: bookDescription,
      aldyBorrowed: from ? user : "",
      _id: id,
    };
    await fetch("/api/book", {
      method: "PATCH",
      body: JSON.stringify(obj),
    }).then((response) => {
      if (response.status === 200) {
        handleClose();
        callApi((prev) => !prev);
      }
    });
  };

  const handleClose2 = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpens(false);
  };
  return (
    <>
      <Card sx={{ marginTop: "10px" }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={BookImg.src}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {bookName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {bookDescription}
            </Typography>
          </CardContent>
        </CardActionArea>
        {aldyBorrowed === "" ? (
          <CardActions>
            <Button
              size="small"
              color="primary"
              disabled={user === "librian" || borrowAmount === 5}
              onClick={() => [handleFrom(true), handleOpen()]}
            >
              Book
            </Button>
          </CardActions>
        ) : user !== aldyBorrowed ? (
          <div className="d-flex justify-content-center align-items-center">
            <p style={{ color: yellow[700] }}>
              This book is already borrowed by <strong>{aldyBorrowed}</strong>
            </p>
          </div>
        ) : (
          <CardActions>
            <Button
              size="small"
              color="error"
              disabled={user === "librian"}
              onClick={() => [handleFrom(false), handleOpen()]}
            >
              Lend 
            </Button>
          </CardActions>
        )}
      </Card>

      <Modal
        keepMounted
        open={opens}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        key={id}
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Are You Sure You Want to {from ? "borrow" : "lend"} this{" "}
            <strong>`{bookName}`</strong> book?
          </Typography>

          <div className="d-flex justify-content-center align-items-center">
            <Button variant="contained" onClick={handleSubmit}>
              Yes
            </Button>
          </div>
        </Box>
      </Modal>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose2}>
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
           { from ? 'You Borrowed new book!' : 'You Lended your book'}
        </Alert>
      </Snackbar>
    </>
  );
}
