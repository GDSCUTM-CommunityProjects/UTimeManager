import React, { useEffect } from "react";
import CredentialsInputBox from "../../components/CredentialsInputBox/CredentialsInputBox.js";
import {
  HeaderText,
  SubtitleText,
} from "../../components/ThemeText/ThemeText.js";
import { CredentialsButton } from "../../components/CredentialsButton/CredentialsButton.js";
import { DescriptiveTextButton } from "../../components/DescriptiveTextButton/DescriptiveTextButton.js";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import styles from "./CredentialsPage.module.css";

const CredentialsPage = ({
  headerText,
  subtitleText,
  actionText,
  nextPage,
  nextPageDescription,
  nextPageText,
}) => {
  const navigate = useNavigate();
  const routeToNextPage = () => {
    navigate(nextPage);
  };

  document.body.style.background = "#032A5C";
  return (
    <div className={styles.credentials_container}>
      <div style={{ marginBottom: "3px" }}>
        <HeaderText data={headerText} />
      </div>
      <div style={{ marginBottom: "10%" }}>
        <SubtitleText data={subtitleText} />
      </div>
      <div style={{ marginBottom: "10%" }}>
        <CredentialsInputBox />
      </div>
      <div>
        <CredentialsButton data={actionText} />
      </div>
      <div style={{ marginTop: "40%" }}>
        <DescriptiveTextButton
          desc={nextPageDescription}
          data={" " + nextPageText}
          onClick={routeToNextPage}
        />
      </div>
    </div>
  );
};

CredentialsPage.propTypes = {
  headerText: PropTypes.string.isRequired,
  subtitleText: PropTypes.string.isRequired,
  actionText: PropTypes.string.isRequired,
  nextPage: PropTypes.string.isRequired,
  nextPageDescription: PropTypes.string.isRequired,
  nextPageText: PropTypes.string.isRequired,
};

export default CredentialsPage;
