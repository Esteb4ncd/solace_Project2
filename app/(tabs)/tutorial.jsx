import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import CircularBackArrowButton from "../../components/ui/CircularBackArrowButton";
import CircularNextArrowButton from "../../components/ui/CircularNextArrowButton";
import TutorialMascot01 from "../../components/ui/TutorialMascot01";

function tutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const backButtonAnim = useRef(new Animated.Value(0)).current;
  const nextButtonAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate progress indicator width based on current step
    Animated.timing(progressAnim, {
      toValue: currentStep,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Animate back button
    Animated.timing(backButtonAnim, {
      toValue: currentStep > 0 ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();

    // Animate next button (keep visible on all steps)
    Animated.timing(nextButtonAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  function animateStepTransition(callback) {
    // Fade out current content
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Change step
      callback();
      // Fade in new content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  }

  function handleNext() {
    if (currentStep < totalSteps - 1) {
      animateStepTransition(() => setCurrentStep(currentStep + 1));
    } else {
      // Navigate to start questions at the end of the tutorial
      router.push('/(tabs)/startQuestions');
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      animateStepTransition(() => setCurrentStep(currentStep - 1));
    }
  }

  function handleSkip() {
    router.push('/(tabs)/startQuestions');
  }

  function renderStepContent() {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Svg width={133} height={244} viewBox="0 0 133 244" fill="none" style={[styles.stepImage, { width: 182 }]}>
              <Path d="M107.044 0C121.924 0 133.606 13.0842 132.328 28.3095L122.867 140.81C121.897 150.02 114.356 156.997 105.374 156.997H29.0509C20.0683 156.997 12.5271 150.02 11.5575 140.81L2.09656 28.3095C0.812395 13.0842 12.5009 0 27.3737 0H107.044Z" fill="#7267D9"/>
              <Path d="M41.1892 75.3033C45.7449 75.3033 49.438 71.5897 49.438 67.0088C49.438 62.4278 45.7449 58.7142 41.1892 58.7142C36.6335 58.7142 32.9404 62.4278 32.9404 67.0088C32.9404 71.5897 36.6335 75.3033 41.1892 75.3033Z" fill="#F6F6F6"/>
              <Path d="M93.2312 75.3033C97.7869 75.3033 101.48 71.5897 101.48 67.0088C101.48 62.4278 97.7869 58.7142 93.2312 58.7142C88.6755 58.7142 84.9824 62.4278 84.9824 67.0088C84.9824 71.5897 88.6755 75.3033 93.2312 75.3033Z" fill="#F6F6F6"/>
              <G clipPath="url(#clip0_1928_6635)">
                <Path d="M122.904 204.578L115.194 199.094C118.02 197.158 119.958 194.662 120.385 191.521C122.343 177.214 100.054 162.906 94.1943 158.541L93.6932 153.257H43.6228L43.1417 158.361L43.1217 158.248C37.9235 162.241 14.5386 176.881 16.543 191.521C16.984 194.735 19.0018 197.278 21.9349 199.227L14.4117 204.571C5.57886 210.853 3.52767 223.078 9.83491 231.875L14.0576 237.765C18.8481 244.446 28.1687 245.996 34.8835 241.225L62.2171 221.793H75.1055L102.439 241.225C109.147 245.996 118.475 244.446 123.265 237.765L127.488 231.875C133.795 223.078 131.744 210.853 122.911 204.571L122.904 204.578Z" fill="url(#paint0_linear_1928_6635)"/>
                <Path d="M44.705 169.92L42.2328 179.297L41.9589 178.904C44.725 179.104 47.431 179.663 50.0501 180.588C55.4153 182.391 60.2726 186.803 60.2927 192.832C60.3194 195.727 59.8717 198.668 58.0945 201.097C51.3329 209.442 35.0971 198.901 25.9235 199.939L25.8901 199.74C28.5761 199.054 31.4223 199.234 34.1417 199.587C36.8744 199.966 39.5536 200.552 42.2061 201.104C46.7829 201.863 53.2772 203.872 56.6981 199.993C58.1947 198.136 58.7626 195.401 58.796 192.866C58.8963 184.234 49.2817 180.355 41.9188 179.516L41.538 179.47L41.6449 179.124L44.5179 169.867L44.7116 169.92H44.705Z" fill="#443E82"/>
                <Path d="M107.123 0C122.296 0 134.209 13.2162 132.906 28.5951L123.258 142.23C122.269 151.533 114.579 158.581 105.419 158.581H27.5872C18.427 158.581 10.7367 151.533 9.74788 142.23L0.0999349 28.5951C-1.20962 13.2162 10.71 0 25.8768 0H107.123Z" fill="url(#paint1_linear_1928_6635)"/>
                <Path d="M39.968 76.0628C44.6138 76.0628 48.3799 72.3118 48.3799 67.6846C48.3799 63.0575 44.6138 59.3064 39.968 59.3064C35.3223 59.3064 31.5562 63.0575 31.5562 67.6846C31.5562 72.3118 35.3223 76.0628 39.968 76.0628Z" fill="#F6F6F6"/>
                <Path d="M93.0383 76.0628C97.6841 76.0628 101.45 72.3118 101.45 67.6846C101.45 63.0575 97.6841 59.3064 93.0383 59.3064C88.3926 59.3064 84.6265 63.0575 84.6265 67.6846C84.6265 72.3118 88.3926 76.0628 93.0383 76.0628Z" fill="#F6F6F6"/>
                <Path d="M90.3859 169.867L93.2589 179.124L93.3658 179.47L92.9849 179.516C85.6287 180.348 76.0008 184.234 76.1077 192.866C76.1411 195.401 76.709 198.136 78.2057 199.993C81.6266 203.872 88.1209 201.863 92.6976 201.111C95.3502 200.558 98.0294 199.973 100.762 199.593C103.481 199.234 106.328 199.061 109.014 199.746L108.98 199.946C99.8067 198.908 83.5775 209.449 76.8093 201.104C75.0253 198.682 74.5777 195.734 74.6111 192.839C74.6311 186.81 79.4885 182.398 84.8537 180.594C87.4728 179.669 90.1788 179.11 92.9449 178.911L92.6709 179.303L90.1988 169.927L90.3926 169.874L90.3859 169.867Z" fill="#443E82"/>
              </G>
              <Path d="M122.518 202.535L114.957 197.106C117.729 195.189 119.629 192.718 120.048 189.609C121.968 175.444 100.111 161.279 94.3648 156.957L93.8734 151.726H44.7737L44.302 156.78L44.2823 156.668C39.185 160.621 16.2534 175.115 18.219 189.609C18.6514 192.791 20.6301 195.307 23.5064 197.238L16.129 202.528C7.46738 208.747 5.45596 220.85 11.6409 229.56L15.7817 235.39C20.4794 242.005 29.6192 243.54 36.2039 238.816L63.0076 219.578H75.6461L102.45 238.816C109.028 243.54 118.174 242.005 122.872 235.39L127.013 229.56C133.198 220.85 131.186 208.747 122.525 202.528L122.518 202.535Z" fill="#7267D9"/>
              <Path d="M45.8358 168.223L43.4116 177.506L43.143 177.117C45.8555 177.315 48.509 177.868 51.0773 178.784C56.3384 180.57 61.1016 184.938 61.1213 190.906C61.1475 193.772 60.7085 196.684 58.9657 199.089C52.3352 207.351 36.4142 196.915 27.4185 197.943L27.3857 197.745C30.0196 197.066 32.8107 197.244 35.4773 197.594C38.157 197.969 40.7843 198.549 43.3854 199.096C47.8734 199.847 54.2418 201.836 57.5964 197.995C59.064 196.157 59.6209 193.45 59.6537 190.939C59.752 182.395 50.3238 178.554 43.1037 177.724L42.7302 177.677L42.835 177.335L45.6523 168.171L45.8423 168.223H45.8358Z" fill="#443E82"/>
              <Path d="M90.6298 168.171L93.4471 177.335L93.5519 177.677L93.1785 177.724C85.9649 178.547 76.5236 182.395 76.6285 190.939C76.6612 193.45 77.2181 196.157 78.6858 197.995C82.0403 201.836 88.4087 199.847 92.8968 199.102C95.4979 198.555 98.1251 197.976 100.805 197.6C103.471 197.244 106.263 197.073 108.896 197.752L108.864 197.949C99.8679 196.922 83.9535 207.357 77.3164 199.096C75.5671 196.698 75.1281 193.779 75.1609 190.913C75.1805 184.944 79.9437 180.576 85.2049 178.791C87.7732 177.875 90.4267 177.322 93.1392 177.124L92.8705 177.513L90.4464 168.23L90.6364 168.177L90.6298 168.171Z" fill="#443E82"/>
              <Path d="M48.4629 157.32C55.4079 156.279 62.3856 156.035 69.383 156.002C76.3804 156.029 83.3516 156.272 90.3031 157.32C83.3581 158.367 76.3804 158.611 69.383 158.637C62.3856 158.605 55.4144 158.361 48.4629 157.32Z" fill="#443E82"/>
              <Defs>
                <LinearGradient id="paint0_linear_1928_6635" x1="67.0678" y1="158.554" x2="69.4407" y2="251.54" gradientUnits="userSpaceOnUse">
                  <Stop stopColor="#443E82"/>
                  <Stop offset="0.02" stopColor="#4B4591"/>
                  <Stop offset="0.07" stopColor="#5951AB"/>
                  <Stop offset="0.12" stopColor="#645BBF"/>
                  <Stop offset="0.18" stopColor="#6C61CE"/>
                  <Stop offset="0.25" stopColor="#7065D6"/>
                  <Stop offset="0.37" stopColor="#7267D9"/>
                  <Stop offset="0.51" stopColor="#7065D5"/>
                  <Stop offset="0.63" stopColor="#6A60CB"/>
                  <Stop offset="0.73" stopColor="#6158BA"/>
                  <Stop offset="0.83" stopColor="#554DA2"/>
                  <Stop offset="0.92" stopColor="#453F84"/>
                  <Stop offset="0.93" stopColor="#443E82"/>
                </LinearGradient>
                <LinearGradient id="paint1_linear_1928_6635" x1="-12.6549" y1="79.2904" x2="147.358" y2="79.2904" gradientUnits="userSpaceOnUse">
                  <Stop offset="0.1" stopColor="#443E83"/>
                  <Stop offset="0.13" stopColor="#524B9D"/>
                  <Stop offset="0.17" stopColor="#5E55B3"/>
                  <Stop offset="0.21" stopColor="#675DC4"/>
                  <Stop offset="0.25" stopColor="#6D62D0"/>
                  <Stop offset="0.32" stopColor="#7166D7"/>
                  <Stop offset="0.51" stopColor="#7267D9"/>
                  <Stop offset="0.69" stopColor="#7166D7"/>
                  <Stop offset="0.75" stopColor="#6D62D0"/>
                  <Stop offset="0.79" stopColor="#675DC4"/>
                  <Stop offset="0.83" stopColor="#5E55B3"/>
                  <Stop offset="0.86" stopColor="#524B9D"/>
                  <Stop offset="0.88" stopColor="#443E83"/>
                  <Stop offset="0.89" stopColor="#443E82"/>
                </LinearGradient>
                <ClipPath id="clip0_1928_6635">
                  <Rect width="133" height="244" fill="white"/>
                </ClipPath>
              </Defs>
            </Svg>
            <Text style={styles.stepTitle}>Meet Solly</Text>
            <Text style={styles.stepSubheading}>
              Solly's life is in your hands.
            </Text>
            <Text style={styles.stepDescription}>
              Complete daily exercises to earn XP, which is Solly's health!
            </Text>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={[styles.stepImage, { width: 228.43 }]}>
              <Svg width={260} height={252} viewBox="0 0 260 252" fill="none">
                <G clipPath="url(#clip0_2428_3780)">
                  <Path d="M187.597 202.976C187.604 199.893 186.183 194.507 184.98 193.3L155.027 142.407L120.713 153.631L111.827 143.778C98.883 168.444 88.9447 183.355 92.9503 190.886C94.9037 194.566 102.869 197.715 110.998 198.378L112.038 210.527C112.084 210.52 112.123 210.514 112.169 210.507L101.645 231.841C99.9156 235.35 101.363 239.595 104.881 241.327L116.661 247.106C123.535 250.478 131.848 247.657 135.229 240.802L146.266 218.425C148.213 218.143 150.159 217.986 152.093 217.979V236.715C152.093 242.809 157.046 247.749 163.156 247.749H172.18C180.704 247.749 187.611 240.861 187.611 232.359V203.173C187.611 203.108 187.604 203.042 187.597 202.97V202.976Z" fill="url(#paint0_linear_2428_3780)"/>
                  <Path d="M114.267 226.127C112.202 230.358 109.321 234.183 105.809 237.332C107.867 233.094 110.761 229.282 114.267 226.127Z" fill="#443E82"/>
                  <Path d="M163.649 155.015C144.779 158.42 125.225 160.349 106.052 160.736L106.039 160.605C120.318 159.26 149.6 155.967 163.649 155.015Z" fill="#443E82"/>
                  <Path d="M38.4969 32.4201C35.5174 17.1809 46.4751 3.61464 62.208 3.07015L146.463 0.150906C162.196 -0.393583 175.949 12.3133 176.225 27.6443L178.238 140.937C178.192 150.22 170.963 157.502 161.466 157.83L80.7493 160.631C71.2517 160.959 62.5303 154.235 60.5176 145.024L38.4969 32.4201Z" fill="url(#paint1_linear_2428_3780)"/>
                  <Path d="M50.0464 24.069C50.4936 28.3921 50.0201 32.794 48.652 36.9203C48.1982 32.5972 48.6849 28.1953 50.0464 24.069Z" fill="#443E82"/>
                  <Path d="M54.8873 24.3445C55.3411 28.4512 54.8873 32.6431 53.5323 36.5529C53.0654 32.4463 53.5389 28.2544 54.8873 24.3445Z" fill="#443E82"/>
                  <Path d="M45.1729 28.9694C49.8888 27.4868 54.8612 26.8833 59.7942 27.2048C55.0848 28.6939 50.1058 29.2843 45.1729 28.9694Z" fill="#443E82"/>
                  <Path d="M45.1729 34.165C49.8822 32.6693 54.8612 32.0395 59.7942 32.3479C55.0848 33.8501 50.1058 34.4668 45.1729 34.165Z" fill="#443E82"/>
                  <Path d="M163.531 138.451C163.505 143.056 162.558 147.635 160.749 151.873C160.769 147.268 161.729 142.689 163.531 138.451Z" fill="#443E82"/>
                  <Path d="M133.335 104.089C137.908 104.089 141.615 100.391 141.615 95.83C141.615 91.2686 137.908 87.5709 133.335 87.5709C128.761 87.5709 125.054 91.2686 125.054 95.83C125.054 100.391 128.761 104.089 133.335 104.089Z" fill="#F6F6F6"/>
                  <Path d="M170.148 138.825C169.917 143.456 168.766 148.029 166.773 152.214C166.997 147.583 168.161 143.017 170.148 138.825Z" fill="#443E82"/>
                  <Path d="M157.96 142.663C163.228 141.626 168.661 141.488 173.976 142.269C168.707 143.312 163.274 143.437 157.96 142.663Z" fill="#443E82"/>
                  <Path d="M157.96 147.242C163.235 146.251 168.668 146.159 173.976 146.986C168.701 147.983 163.268 148.062 157.96 147.242Z" fill="#443E82"/>
                  <Path d="M151.363 20.4348C152.823 22.1338 152.994 24.5939 151.764 26.4635C150.297 24.771 150.14 22.3109 151.363 20.4348Z" fill="#443E82"/>
                  <Path d="M156.921 20.4282C158.453 23.026 158.677 26.2535 157.493 29.035C155.954 26.4372 155.75 23.2096 156.921 20.4282Z" fill="#443E82"/>
                  <Path d="M163.176 20.4216C164.748 23.6295 165.011 27.395 163.867 30.7866C162.282 27.5787 162.038 23.8132 163.176 20.4216Z" fill="#443E82"/>
                  <Path d="M119.878 228.876C117.622 233.054 114.576 236.794 110.919 239.831C113.169 235.646 116.227 231.92 119.878 228.876Z" fill="#443E82"/>
                  <Path d="M162.946 209.372C169.01 204.479 175.64 200.28 182.678 196.908C176.613 201.809 169.977 205.994 162.946 209.372Z" fill="#443E82"/>
                  <Path d="M164.919 212.652C170.319 208.106 176.298 204.256 182.678 201.225C177.284 205.771 171.299 209.615 164.919 212.652Z" fill="#443E82"/>
                  <Path d="M167.55 201.5C169.253 204.957 170.134 208.802 170.075 212.652C168.365 209.202 167.497 205.351 167.55 201.5Z" fill="#443E82"/>
                  <Path d="M172.812 199.532C174.344 203.029 175.035 206.873 174.785 210.684C173.246 207.188 172.568 203.344 172.812 199.532Z" fill="#443E82"/>
                  <Path d="M178.073 195.596C179.435 200.044 179.922 204.741 179.481 209.372C178.113 204.925 177.639 200.228 178.073 195.596Z" fill="#443E82"/>
                  <Path d="M99.8039 109.659C99.0015 114.428 94.0159 117.183 89.9972 119.053C81.7624 122.72 65.3587 124.878 60.3008 115.373C58.6827 112.066 59.4391 108.104 60.919 104.995C60.0179 109.18 60.1692 114.159 63.8854 116.783C70.6008 121.323 81.8808 119.512 89.254 117.15C93.2727 115.648 97.9886 113.87 99.8039 109.659Z" fill="#443E82"/>
                  <Path d="M89.6088 98.8346C78.5853 106.044 54.6308 114.972 53.5061 94.19C52.6839 79.7381 61.9645 68.7696 76.5134 67.7724C80.3085 67.6675 84.7613 67.8512 87.6356 70.6261C84.5114 68.3891 80.2822 68.6253 76.645 69.0582C63.9903 70.9803 56.0252 79.8955 56.0646 92.7009C55.5187 112.539 78.7628 103.597 89.6088 98.8411V98.8346Z" fill="#443E82"/>
                  <Path d="M107.519 227.931C112.518 228.902 117.332 230.758 121.673 233.415C116.675 232.451 111.867 230.581 107.519 227.931Z" fill="#443E82"/>
                  <Path d="M105.46 232.09C110.446 233.107 115.24 235.003 119.555 237.699C114.57 236.689 109.781 234.78 105.46 232.09Z" fill="#443E82"/>
                  <Path d="M111.603 198.522C120.305 197.807 131.381 193.936 129.632 183.27C128.395 176.861 125.166 169.749 117.733 169.428C115.162 169.225 112.458 169.703 109.887 170.254L110.321 169.316C111.656 166.463 113.017 163.629 114.451 160.821C113.958 162.317 113.445 163.806 112.919 165.288C112.379 166.765 111.86 168.254 111.307 169.723L110.683 169.002C114.945 167.709 120.114 167.099 124.087 169.638C128.593 172.544 130.625 177.976 131.539 182.994C133.223 194.756 121.423 199.204 111.61 198.515L111.603 198.522Z" fill="#443E82"/>
                  <Path d="M156.697 156.564C159.657 164.764 157.684 166.076 155.053 168.044C160.643 165.748 158.374 170.996 158.374 170.996C158.374 170.996 160.972 166.076 163.603 174.604C163.603 168.7 168.865 171.324 170.18 172.636C168.207 167.388 171.496 163.452 178.073 168.044C178.073 168.044 176.758 160.828 172.811 160.828C173.469 156.892 170.838 151.643 170.838 151.643C170.838 151.643 170.18 158.204 167.55 157.548C164.919 156.892 161.63 154.923 164.919 150.331C159.657 154.923 161.959 158.532 161.959 158.532C161.959 158.532 159.328 161.156 156.697 156.564Z" fill="#F6F6F6"/>
                  <Path d="M228.199 220.721C222.806 219.803 199.956 232.969 197.102 234.629C196.556 234.052 196.266 233.094 195.174 231.677C197.148 236.269 193.201 236.269 193.201 236.269C193.201 236.269 197.148 238.237 193.201 238.237C196.49 240.861 193.859 242.829 191.228 242.829C192.543 244.141 195.174 244.141 195.174 244.141C195.174 244.141 192.215 245.781 192.215 249.061C192.872 246.437 198.134 245.781 198.134 245.781C198.134 245.781 198.147 245.748 198.167 245.689L226.634 240.592C226.634 240.592 255.034 260.082 259.559 247.113C264.025 234.307 233.579 221.64 228.199 220.721Z" fill="url(#paint2_linear_2428_3780)"/>
                  <Path d="M84.0181 132.291H142.556C150.725 132.291 157.355 138.904 157.355 147.051C157.355 151.578 153.672 155.252 149.133 155.252H77.4408C72.9025 155.252 69.2192 151.578 69.2192 147.051C69.2192 138.904 75.8491 132.291 84.0181 132.291Z" fill="#F6F6F6"/>
                  <Path d="M140.912 145.411L142.227 175.476" stroke="#F6F6F6" strokeWidth="17" strokeMiterlimit="10" strokeLinecap="round"/>
                  <Path d="M257.658 250.045C251.173 256.231 233.237 246.089 227.028 241.943L228.232 242.199C217.721 243.984 207.145 245.519 196.49 246.102C201.607 244.528 206.79 243.269 211.999 242.107C217.406 240.881 222.851 239.831 228.304 238.86C234.092 242.494 251.403 254.099 257.658 250.039V250.045Z" fill="#443E82"/>
                  <Path d="M165.531 156.695L166.708 157.075C167.287 157.226 168.208 157.646 168.615 157.121C169.477 155.435 169.523 153.297 169.964 151.44L170.661 147.799C171.108 149.295 171.878 152.195 172.45 153.592C173.483 155.783 174.075 158.381 173.982 160.834L173.042 159.686C174.857 160.008 176.508 161.156 177.534 162.664C178.567 164.14 179.08 165.892 179.073 167.644V170.11C177.791 168.916 176.363 167.466 174.581 166.961C172.476 166.24 170.424 166.574 170.108 169.133C169.97 170.248 170.082 171.435 170.247 172.623L170.122 172.662C168.819 168.569 169.694 164.619 174.857 165.964C176.021 166.286 177.14 166.81 178.074 167.591L177.889 167.676C177.83 164.672 175.877 161.549 172.792 160.952L172.693 160.933V160.828C172.687 159.26 172.647 157.672 172.18 156.177C171.687 154.694 171.069 153.211 170.746 151.663H170.937L170.345 154.058C169.99 155.232 169.812 156.544 168.99 157.508C167.945 158.361 166.498 157.193 165.478 156.806L165.537 156.688L165.531 156.695Z" fill="#443E82"/>
                </G>
                <Defs>
                  <LinearGradient id="paint0_linear_2428_3780" x1="139.833" y1="156.951" x2="139.833" y2="252.262" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.02" stopColor="#443E82"/>
                    <Stop offset="0.07" stopColor="#5951AB"/>
                    <Stop offset="0.12" stopColor="#645BBF"/>
                    <Stop offset="0.18" stopColor="#6C61CE"/>
                    <Stop offset="0.25" stopColor="#7065D6"/>
                    <Stop offset="0.37" stopColor="#7267D9"/>
                    <Stop offset="0.51" stopColor="#7065D5"/>
                    <Stop offset="0.63" stopColor="#6A60CB"/>
                    <Stop offset="0.73" stopColor="#6158BA"/>
                    <Stop offset="0.83" stopColor="#554DA2"/>
                    <Stop offset="0.92" stopColor="#453F84"/>
                    <Stop offset="0.93" stopColor="#443E82"/>
                  </LinearGradient>
                  <LinearGradient id="paint1_linear_2428_3780" x1="-12.6549" y1="79.2904" x2="147.358" y2="79.2904" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.1" stopColor="#443E83"/>
                    <Stop offset="0.13" stopColor="#524B9D"/>
                    <Stop offset="0.17" stopColor="#5E55B3"/>
                    <Stop offset="0.21" stopColor="#675DC4"/>
                    <Stop offset="0.25" stopColor="#6D62D0"/>
                    <Stop offset="0.32" stopColor="#7166D7"/>
                    <Stop offset="0.51" stopColor="#7267D9"/>
                    <Stop offset="0.69" stopColor="#7166D7"/>
                    <Stop offset="0.75" stopColor="#6D62D0"/>
                    <Stop offset="0.79" stopColor="#675DC4"/>
                    <Stop offset="0.83" stopColor="#5E55B3"/>
                    <Stop offset="0.86" stopColor="#524B9D"/>
                    <Stop offset="0.88" stopColor="#443E83"/>
                    <Stop offset="0.89" stopColor="#443E82"/>
                  </LinearGradient>
                  <LinearGradient id="paint2_linear_2428_3780" x1="226.634" y1="220.721" x2="226.634" y2="250.045" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.02" stopColor="#443E82"/>
                    <Stop offset="0.07" stopColor="#5951AB"/>
                    <Stop offset="0.12" stopColor="#645BBF"/>
                    <Stop offset="0.18" stopColor="#6C61CE"/>
                    <Stop offset="0.25" stopColor="#7065D6"/>
                    <Stop offset="0.37" stopColor="#7267D9"/>
                    <Stop offset="0.51" stopColor="#7065D5"/>
                    <Stop offset="0.63" stopColor="#6A60CB"/>
                    <Stop offset="0.73" stopColor="#6158BA"/>
                    <Stop offset="0.83" stopColor="#554DA2"/>
                    <Stop offset="0.92" stopColor="#453F84"/>
                    <Stop offset="0.93" stopColor="#443E82"/>
                  </LinearGradient>
                  <ClipPath id="clip0_2428_3780">
                    <Rect width="260" height="252" fill="white"/>
                  </ClipPath>
                </Defs>
              </Svg>
            </View>
            <Text style={styles.stepTitle}>Feel like skipping days?</Text>
            <Text style={styles.stepDescription}>
              You'll lose XP and we'll rip his arms off!
            </Text>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={[styles.stepImage, { width: 163.88 }]}>
              <TutorialMascot01 width={216} height={296} />
            </View>
            <Text style={styles.stepTitle}>
              Completing your exercises everyday?
            </Text>
            <Text style={styles.stepDescription}>
              You'll level up and we'll pump him with steroids! Yay!
            </Text>
          </View>
        );
      default:
        return null;
    }
  }

  function renderStepIndicator() {
    return (
      <View style={styles.progressBarContainer}>
        {[0, 1, 2].map((step) => {
          const isActive = currentStep === step;
          const animatedWidth = progressAnim.interpolate({
            inputRange: [step - 0.5, step, step + 0.5],
            outputRange: [4, 36, 4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={step}
              style={[
                styles.stroke,
                {
                  width: isActive ? animatedWidth : 4,
                  opacity: currentStep >= step ? 1 : 0.3,
                },
              ]}
            />
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={handleSkip} style={styles.skipButtonContainer}>
        <Text style={styles.skip}>Skip</Text>
      </Pressable>
      <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
        {renderStepContent()}
      </Animated.View>
      <View style={styles.progressIndicatorContainer}>
        {renderStepIndicator()}
        <View style={styles.buttonsContainer}>
          <Animated.View
            style={{
              opacity: backButtonAnim,
              transform: [
                {
                  scale: backButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
                {
                  translateX: backButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            }}
          >
            {currentStep > 0 && (
              <CircularBackArrowButton onPress={handleBack} />
            )}
          </Animated.View>

          <Animated.View
            style={{
              opacity: nextButtonAnim,
              transform: [
                {
                  scale: nextButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
                {
                  translateX: nextButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          >
            <CircularNextArrowButton onPress={handleNext} />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

export default tutorial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: 852,
    width: 393,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  skip: {
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
  },
  skipButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 30 : 60, // Match PagesMenu positioning
    right: 20,
    zIndex: 1000,
    padding: 8,
  },
  stepContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 110,
  },
  stepContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  stepImage: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 18,
    color: "black",
    textAlign: "center",
  },
  stepSubheading: {
    fontSize: 16,
    margin: 8,
    color: "black",
    fontWeight: "bold",
  },
  stepDescription: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 40,
    color: "black",
    margin: 8,
  },
  progressIndicatorContainer: {
    position: "absolute",
    bottom: 70,
    alignItems: "center",
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  stroke: {
    height: 1,
    borderWidth: 4,
    borderRadius: 6,
    borderColor: "#A2BC60",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    gap: 20,
    marginTop: 50,
  },
});
