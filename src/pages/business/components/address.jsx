import { useState, useRef, useMemo, useEffect, memo } from "react";
import { useWatch } from "react-hook-form";
import {
  Box,
  Typography,
  MenuItem,
  Autocomplete,
  LinearProgress,
} from "@mui/material";

import { useAddressQuery } from "../../../services/address-services";
import { Grid, Input, TextField, GradientButton } from "../../../components";
import { countries } from "../../../helper/constants";
import { useMounted } from "../../../hooks";

const Address = ({ errors, setValue, setFocus, control }) => {
  const mounted = useMounted();
  const [manual, setManual] = useState(false);
  const [address, setAddress] = useState(null);
  const previousPostcode = useRef("");
  const postcode = useWatch({
    name: "postcode",
    defaultValue: "",
    control: control,
  });
  const {
    data: addresses = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAddressQuery(postcode);

  const addressChangeHandler = (e, newValue) => setAddress(newValue);
  const postcodeBlurHandler = () => {
    if (manual || previousPostcode.current === postcode || !postcode) return;
    refetch();
    previousPostcode.current = postcode;
  };
  const manualClickHandler = () => {
    setManual((value) => !value);
    setFocus("postcode");
    setValue("postcode", currentAddress?.postcode || postcode);
    setValue("city", currentAddress?.posttown || "");
    setValue("line1", currentAddress?.addressline1 || "");
    setValue("line2", currentAddress?.addressline2 || "");
    setValue("geo", geo);
  };

  const addressOptions = useMemo(() => {
    return addresses.map(({ summaryline }) => summaryline);
  }, [addresses]);
  const currentAddress = useMemo(
    () => addresses.find(({ summaryline }) => summaryline === address) || {},
    [addresses, address],
  );
  const geo = useMemo(
    () =>
      currentAddress?.latitude && currentAddress?.longitude
        ? `${currentAddress?.latitude}, ${currentAddress?.longitude}`
        : "",
    [currentAddress],
  );

  useEffect(() => {
    // for keeping default form values on mount
    if (!mounted) return;
    if (!manual) {
      // checks are for keeping default or old values when no address is selected
      currentAddress?.postcode && setValue("postcode", currentAddress.postcode);
      currentAddress?.posttown && setValue("city", currentAddress.posttown);
      currentAddress?.addressline1 &&
        setValue("line1", currentAddress.addressline1);
      currentAddress?.addressline2 &&
        setValue("line2", currentAddress.addressline2);
      geo && setValue("geo", geo);
    }
    // // Will clear address fields when switching from automatic to manual
    // else {
    //   setValue("postcode", currentAddress?.postcode || "");
    //   setValue("city", currentAddress?.posttown || "");
    //   setValue("line1", currentAddress?.addressline1 || "");
    //   setValue("line2", currentAddress?.addressline2 || "");
    // }
  }, [mounted, manual, setValue, currentAddress, geo]);

  console.log("rendering");
  return (
    <Grid
      columnCount={2}
      sx={{
        bgcolor: "#ECEBF0",
        p: 2,
        borderRadius: 2,
        gridColumnEnd: "span 3",
        position: "relative",
      }}
    >
      {isError && (
        <Typography
          color="error"
          sx={{ position: "absolute", top: "20px", right: "20px" }}
        >
          Something went wrong while getting the address list!
        </Typography>
      )}
      {(isLoading || isFetching) && (
        <LinearProgress
          sx={{ position: "absolute", top: 0, right: 0, width: "100%" }}
        />
      )}
      <Typography
        component="h3"
        sx={{
          fontWeight: "bold",
          fontSize: "14px",
          gridColumnEnd: "span 2",
        }}
      >
        Address
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gridRow: "2 / span 7",
          gridColumnStart: "2",
        }}
      >
        <GradientButton onClick={manualClickHandler}>
          {manual ? "Enter Address Automatically" : "Enter Address Manually"}
        </GradientButton>
      </Box>
      <Input
        name="postcode"
        control={control}
        onBlur={postcodeBlurHandler}
        error={!!errors?.postcode?.message}
        variant="filled"
        label="Enter a postcode*"
      />
      <Autocomplete
        disablePortal
        disabled={manual}
        options={addressOptions}
        value={address}
        onChange={addressChangeHandler}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label="Start typing an address"
          />
        )}
      />
      <Input
        name="line1"
        control={control}
        error={!!errors?.line1?.message}
        variant="filled"
        label="Address Line 1*"
        inputProps={{ readOnly: !manual }}
      />
      <Input
        name="line2"
        control={control}
        variant="filled"
        label="Address Line 2"
        inputProps={{ readOnly: !manual }}
      />
      <Input
        name="city"
        control={control}
        error={!!errors?.city?.message}
        variant="filled"
        label="City / Town*"
        inputProps={{ readOnly: !manual }}
      />
      <Input
        name="country"
        control={control}
        error={!!errors?.country?.message}
        variant="filled"
        label="Country*"
        select
        defaultValue="GB"
      >
        {countries
          .sort(({ label: labelA }, { label: labelB }) =>
            labelA > labelB ? 1 : -1,
          )
          .map(({ code, label }) => (
            <MenuItem key={code} value={code}>
              {label}
            </MenuItem>
          ))}
      </Input>
      <Input
        name="geo"
        control={control}
        variant="filled"
        label="Geo Location"
        inputProps={{ readOnly: !manual }}
      />
    </Grid>
  );
};

export default memo(Address);