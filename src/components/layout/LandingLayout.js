import { NoSsr, Stack, styled } from "@mui/material";
import HeaderComponent from "../header";
import FooterComponent from "../footer";
import PropTypes from "prop-types";
import useGetLandingPage from "api-manage/hooks/react-query/useGetLandingPage";
import { useEffect } from "react";
import styles from "../landing-page/FastaLanding.module.css";

export const MainLayoutRoot = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
}));

export const LandingLayout = ({ children, configData, landingPageData }) => {
  const { data } = useGetLandingPage();

  return (
    <MainLayoutRoot justifyContent="space-between" className={styles.landing}>
      <header>
        <HeaderComponent configData={configData} />
      </header>
      {children}
      <footer>
        <FooterComponent configData={configData} landingPageData={data} />
      </footer>
    </MainLayoutRoot>
  );
};

LandingLayout.propTypes = {
  children: PropTypes.node,
};
