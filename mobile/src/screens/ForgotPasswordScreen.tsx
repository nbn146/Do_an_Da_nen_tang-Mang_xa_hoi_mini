import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Lock, Mail, CheckCircle } from "lucide-react-native";
import { useLanguage } from "../store/LanguageContext";
import { api } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { palette, ui } from "../theme";
import { ScreenGradient } from "../components/common/ScreenGradient";

export default function ForgotPasswordScreen({ navigation }: any) {
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
  const [account, setAccount] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isPhoneNumber = (input: string) => /^[0-9]{9,11}$/.test(input.trim());

  const handleSendOtp = async () => {
    if (!account.trim()) {
      Alert.alert(t("Lỗi", "Error"), t("Vui lòng nhập email hoặc số điện thoại.", "Please enter email or phone number."));
      return;
    }
    try {
      setIsLoading(true);
      const isPhone = isPhoneNumber(account);
      if (isPhone) {
        await api.post(ENDPOINTS.SEND_PHONE_OTP, { phone_number: account.trim() });
      } else {
        await api.post(ENDPOINTS.SEND_EMAIL_OTP, { email: account.trim() });
      }
      setStep(2);
      Alert.alert(t("Thành công", "Success"), t("Mã OTP đã được gửi.", "OTP has been sent."));
    } catch (e: any) {
      Alert.alert(
        t("Lỗi", "Error"),
        e.response?.data?.message || t("Không thể gửi mã OTP.", "Could not send OTP.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim() || !newPassword.trim()) {
      Alert.alert(t("Lỗi", "Error"), t("Vui lòng nhập mã OTP và mật khẩu mới.", "Please enter OTP and new password."));
      return;
    }
    try {
      setIsLoading(true);
      const isPhone = isPhoneNumber(account);
      await api.post(ENDPOINTS.RESET_PASSWORD, {
        phone_number: isPhone ? account.trim() : undefined,
        email: isPhone ? undefined : account.trim(),
        otp: otp.trim(),
        newPassword,
      });
      Alert.alert(
        t("Thành công", "Success"),
        t("Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập.", "Password reset successfully. Please login."),
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      Alert.alert(
        t("Lỗi", "Error"),
        e.response?.data?.message || t("Mã OTP không hợp lệ hoặc đã hết hạn.", "Invalid or expired OTP.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenGradient>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft color={palette.ink} size={24} />
            </Pressable>
            <View style={styles.titleContainer}>
              <View style={styles.iconCircle}>
                <Lock color={palette.primary} size={32} />
              </View>
              <Text style={ui.title}>{t("Quên mật khẩu", "Forgot Password")}</Text>
              <Text style={ui.subtitle}>
                {step === 1
                  ? t("Nhập email hoặc số điện thoại để nhận mã OTP khôi phục mật khẩu.", "Enter your email or phone number to receive an OTP.")
                  : t("Nhập mã OTP đã nhận và mật khẩu mới của bạn.", "Enter the OTP you received and your new password.")}
              </Text>
            </View>
          </View>

          <View style={ui.card}>
            {step === 1 ? (
              <View style={styles.field}>
                <Text style={styles.label}>{t("Email hoặc số điện thoại", "Email or phone number")}</Text>
                <View style={ui.inputWrapper}>
                  <Mail color={palette.muted} size={20} />
                  <TextInput
                    value={account}
                    onChangeText={setAccount}
                    placeholder={t("email@gmail.com hoặc 0987654321", "email@gmail.com or 0987654321")}
                    style={ui.input}
                    autoCapitalize="none"
                    placeholderTextColor={palette.muted}
                  />
                </View>
              </View>
            ) : (
              <>
                <View style={styles.field}>
                  <Text style={styles.label}>{t("Mã OTP", "OTP Code")}</Text>
                  <View style={ui.inputWrapper}>
                    <CheckCircle color={palette.muted} size={20} />
                    <TextInput
                      value={otp}
                      onChangeText={setOtp}
                      placeholder={t("Nhập mã OTP (6 số)", "Enter OTP code (6 digits)")}
                      style={ui.input}
                      keyboardType="number-pad"
                      placeholderTextColor={palette.muted}
                    />
                  </View>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>{t("Mật khẩu mới", "New password")}</Text>
                  <View style={ui.inputWrapper}>
                    <Lock color={palette.muted} size={20} />
                    <TextInput
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder={t("Nhập mật khẩu mới", "Enter new password")}
                      style={ui.input}
                      secureTextEntry
                      placeholderTextColor={palette.muted}
                    />
                  </View>
                </View>
              </>
            )}

            <View style={ui.buttonContainer}>
              <Pressable
                onPress={step === 1 ? handleSendOtp : handleResetPassword}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[palette.primary, palette.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[ui.button, isLoading ? styles.disabled : null]}
                >
                  <Text style={ui.buttonText}>
                    {isLoading
                      ? t("Đang xử lý...", "Processing...")
                      : step === 1
                      ? t("Gửi mã OTP", "Send OTP")
                      : t("Đặt lại mật khẩu", "Reset Password")}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: 8,
    zIndex: 10,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(147, 51, 234, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.ink,
    marginBottom: 8,
  },
  disabled: {
    opacity: 0.7,
  },
});
