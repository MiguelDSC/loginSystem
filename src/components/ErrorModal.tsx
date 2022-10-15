import React from "react";
import styles from "./ErrorModal.module.css";

interface ErrorModalProps {
  message: string;
  title: string;
  onCloseModal: () => void;
}

function ErrorModal(props: ErrorModalProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e.target, e.currentTarget);

    if (e.target === e.currentTarget) props.onCloseModal();
  };
  return (
    <>
      <div className={styles.backdrop} onClick={handleClick}>
        <div className={styles.modal}>
          <section>
            <h1>{props.title}</h1>
            <h2>{props.message}</h2>
            <button onClick={props.onCloseModal}>GOT IT!</button>
          </section>
        </div>
      </div>
    </>
  );
}

export default ErrorModal;
