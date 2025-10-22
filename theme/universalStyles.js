import { StyleSheet } from "react-native";

const universalStyles = StyleSheet.create({
  input: {
    height: 45,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    width: 250,
    fontSize: 16,
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    paddingTop: 100,
  },
  container: {
    flex: 1,
    padding: 30,
    marginTop: 60,
  },
  heading: {
    fontSize: 28,
    fontFamily: "Aspekta 600",
  },
  subheading: {
    fontSize: 20,
    fontFamily: "Aspekta 550",
    marginTop: 10,
    textAlign: "left",
  },
  bottomText: {
    textAlign: "center",
    color: "grey",
  },
  button: {
    padding: 10,
    paddingVertical: 25,
    borderRadius: 25,
  },
  back: {
    paddingTop: 12,
    paddingRight: 10,
  },
  headerContent: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center items vertically
  },
  mainContent: {
    marginTop: 50,
  },
  /* --------------- POPUP MODAL STYLING --------------- */
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    elevation: 5,
    width: 250,
  },
  modalInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  modalSubmitButton: {
    padding: 15,
    borderRadius: 25,
    width: 100,
  },
  modalSubmitText: {
    color: "white",
    textAlign: "center",
  },
  modalCancelButton: {
    padding: 15,
    borderRadius: 25,
    width: 100,
    backgroundColor: "grey",
  },
  /* ----------------------------------------------------- */
  buttonText: {
    textAlign: "center",
  },
  loginSignupButton: {
    backgroundColor: "#ff611a",
    padding: 15,
    borderRadius: 25,
    width: 150,
    marginVertical: 10,
    marginTop: 40,
    marginBottom: 20,
    fontSize: 18,
  },
});

export default universalStyles;
