import React from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { kenyanPhoneTest } from "utils/kenyanPhone";

const ValidationSchemaForAddAddress = () => {
  const { t } = useTranslation();
  return Yup.object({
    address: Yup.string().required(t("Address is required")),
    contact_person_name: Yup.string().required(t("Name is required")),
    contact_person_number: Yup.string().test(...kenyanPhoneTest(t)).required(t("Phone Number is required")),
  });
};
export default ValidationSchemaForAddAddress;
