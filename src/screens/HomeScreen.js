import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebase_auth } from "./src/firebaseConfig";

//importing screens
import ProtectedAreaScreen from "./ProtectedAreaScreen";
import SignInScreen from "./SignInScreen";
import CameraScreen from "./CameraScreen";
import GalleryScreen from "./GalleryScreen";
import EditScreen from "./EditScreen";
import ShareScreen from "./ShareScreen";

//create navigators
const MainTab = createBottomTabNavigator();
const CameraEditStack = createNativeStackNavigator(); //from Camera to Editor
const EditShareStack = createNativeStackNavigator(); //from Editor to Share
const GalleryPhotoStack = createNativeStackNavigator(); //from Gallery to Individual Photostrip
const PhotoShareStack = createNativeStackNavigator(); //from Individual Photostrip to Share

export default function HomeScreen() {}
