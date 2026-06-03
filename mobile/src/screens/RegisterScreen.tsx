import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View, StyleSheet, Alert } from "react-native";
import { Mail, Lock, User, AtSign, ArrowRight, Eye, EyeOff, Send, Phone } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../store/AuthContext";
import { useLanguage } from "../store/LanguageContext";
import { api } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { ui, palette } from "../theme";
import { ScreenGradient } from "../components/common/ScreenGradient";
import { getAccountType } from "../utils/validators";

type RegisterFormData = {
  username: string;
  display_name: string;
  contact: string;
  password: string;
  otp: string;
};

type ContactType = "email" | "phone";

const normalizeContact = (value: string, type: ContactType) => {
  const trimmed = value.trim();
  return type === "phone" ? trimmed.replace(/\s/g, "") : trimmed.toLowerCase();
};

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTarget, setOtpTarget] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const registerSchema = useMemo(
    () =>
      z.object({
        username: z
          .string()
          .min(3, t("Tên tài khoản phải có ít nhất 3 ký tự", "Username must be at least 3 characters"))
          .max(30, t("Tên tài khoản tối đa 30 ký tự", "Username must be at most 30 characters"))
          .regex(/^[a-zA-Z0-9_]+$/, t("Chỉ chấp nhận chữ cái, số và dấu gạch dưới", "Only letters, numbers, and underscores are accepted")),
        display_name: z
          .string()
          .min(1, t("Vui lòng nhập tên hiển thị", "Please enter a display name"))
          .max(50, t("Tên hiển thị tối đa 50 ký tự", "Display name must be at most 50 characters")),
        contact: z
          .string()
          .min(1, t("Vui lòng nhập email hoặc số điện thoại", "Please enter an email or phone number"))
          .refine(
            (value) => getAccountType(value) !== "unknown",
            t("Email hoặc số điện thoại không hợp lệ", "Invalid email or phone number"),
          ),
        password: z
          .string()
          .min(6, t("Mật khẩu phải có ít nhất 6 ký tự", "Password must be at least 6 characters")),
        otp: z
          .string()
          .min(1, t("Vui lòng nhập mã OTP", "Please enter the OTP code")),
      }),
    [t],
  );

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      display_name: "",
      contact: "",
      password: "",
      otp: "",
    },
  });

  const sendOtp = async () => {
    const rawContact = getValues("contact");
    const contactType = getAccountType(rawContact);
    if (contactType === "unknown") {
      setServerError(t("Vui lòng nhập email hoặc số điện thoại hợp lệ trước khi gửi OTP", "Please enter a valid email or phone number before sending OTP"));
      return;
    }
    const contact = normalizeContact(rawContact, contactType);
    try {
      setSendingOtp(true);
      setServerError("");
      await api.post(
        contactType === "phone" ? ENDPOINTS.SEND_PHONE_OTP : ENDPOINTS.SEND_EMAIL_OTP,
        contactType === "phone" ? { phone_number: contact } : { email: contact },
      );
      setOtpSent(true);
      setOtpTarget(contact);
      Alert.alert(t("Thành công", "Success"), t("Mã OTP đã được gửi đến thông tin liên hệ của bạn", "OTP has been sent to your contact"));
    } catch (error: any) {
      setServerError(error.response?.data?.message || t("Gửi OTP thất bại", "Failed to send OTP"));
    } finally {
      setSendingOtp(false);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    if (!otpSent) {
      setServerError(t("Vui lòng gửi mã OTP trước khi đăng ký", "Please send OTP before registering"));
      return;
    }
    const contactType = getAccountType(data.contact);
    if (contactType === "unknown") {
      setServerError(t("Email hoặc số điện thoại không hợp lệ", "Invalid email or phone number"));
      return;
    }
    const contact = normalizeContact(data.contact, contactType);
    if (otpTarget && contact !== otpTarget) {
      setServerError(t("Vui lòng gửi lại OTP cho email hoặc số điện thoại này", "Please resend OTP for this email or phone number"));
      return;
    }
    const result = await register({
      username: data.username.trim(),
      display_name: data.display_name.trim(),
      ...(contactType === "phone" ? { phone_number: contact } : { email: contact }),
      password: data.password,
      otp: data.otp.trim(),
    });
    if (result.ok) {
      Alert.alert(t("Thành công", "Success"), t("Đăng ký thành công! Đăng nhập ngay.", "Registration successful. Please log in."), [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } else {
      setServerError(result.message || t("Đăng ký thất bại", "Registration failed"));
    }
  };

  return (
    <ScreenGradient style={ui.page}>
      <View style={styles.header}>
        <Text style={ui.title}>{t("Đăng ký", "Register")}</Text>
        <Text style={ui.subtitle}>{t("Tạo hồ sơ của bạn để tham gia mạng xã hội", "Create your profile to join the social network")}</Text>
      </View>

      <View style={ui.card}>
        {/* Username */}
        <View style={styles.field}>
          <Text style={styles.label}>{t("Tên tài khoản", "Username")}</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[ui.inputWrapper, errors.username ? styles.inputError : null]}>
                <AtSign color={palette.muted} size={20} />
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t("Nhập tên tài khoản (a-z, 0-9, _)", "Enter username (a-z, 0-9, _)")}
                  style={ui.input}
                  autoCapitalize="none"
                  placeholderTextColor={palette.muted}
                />
              </View>
            )}
          />
          {errors.username ? (
            <Text style={styles.errorText}>{errors.username.message}</Text>
          ) : null}
        </View>

        {/* Display Name */}
        <View style={styles.field}>
          <Text style={styles.label}>{t("Tên hiển thị", "Display name")}</Text>
          <Controller
            control={control}
            name="display_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[ui.inputWrapper, errors.display_name ? styles.inputError : null]}>
                <User color={palette.muted} size={20} />
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t("Nhập họ và tên", "Enter full name")}
                  style={ui.input}
                  placeholderTextColor={palette.muted}
                />
              </View>
            )}
          />
          {errors.display_name ? (
            <Text style={styles.errorText}>{errors.display_name.message}</Text>
          ) : null}
        </View>

        {/* Email or phone */}
        <View style={styles.field}>
          <Text style={styles.label}>{t("Email hoặc số điện thoại", "Email or phone number")}</Text>
          <Controller
            control={control}
            name="contact"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[ui.inputWrapper, errors.contact ? styles.inputError : null]}>
                {getAccountType(value) === "phone" ? (
                  <Phone color={palette.muted} size={20} />
                ) : (
                  <Mail color={palette.muted} size={20} />
                )}
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t("Nhập email hoặc số điện thoại", "Enter email or phone number")}
                  style={ui.input}
                  autoCapitalize="none"
                  keyboardType="default"
                  placeholderTextColor={palette.muted}
                />
              </View>
            )}
          />
          {errors.contact ? (
            <Text style={styles.errorText}>{errors.contact.message}</Text>
          ) : null}
        </View>

        {/* Password */}
        <View style={styles.field}>
          <Text style={styles.label}>{t("Mật khẩu", "Password")}</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[ui.inputWrapper, errors.password ? styles.inputError : null]}>
                <Lock color={palette.muted} size={20} />
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t("Nhập mật khẩu (tối thiểu 6 ký tự)", "Enter password (minimum 6 characters)")}
                  secureTextEntry={!showPassword}
                  style={ui.input}
                  placeholderTextColor={palette.muted}
                />
                <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? (
                    <EyeOff color={palette.muted} size={20} />
                  ) : (
                    <Eye color={palette.muted} size={20} />
                  )}
                </Pressable>
              </View>
            )}
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          ) : null}
        </View>

        {/* OTP */}
        <View style={styles.field}>
          <View style={styles.otpHeader}>
            <Text style={styles.label}>{t("Mã OTP", "OTP code")}</Text>
            <Pressable onPress={sendOtp} disabled={sendingOtp}>
              <View style={[styles.otpBtn, otpSent ? styles.otpSentBtn : null]}>
                <Send color={otpSent ? "#22c55e" : palette.primary} size={14} style={styles.otpBtnIcon} />
                <Text style={[styles.otpBtnText, otpSent ? styles.otpSentText : null]}>
                  {sendingOtp ? t("Đang gửi...", "Sending...") : otpSent ? t("Gửi lại OTP", "Resend OTP") : t("Gửi OTP", "Send OTP")}
                </Text>
              </View>
            </Pressable>
          </View>
          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[ui.inputWrapper, errors.otp ? styles.inputError : null]}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t("Nhập mã OTP", "Enter OTP")}
                  style={ui.input}
                  keyboardType="number-pad"
                  placeholderTextColor={palette.muted}
                  editable={otpSent}
                />
              </View>
            )}
          />
          {errors.otp ? (
            <Text style={styles.errorText}>{errors.otp.message}</Text>
          ) : null}
        </View>

        {/* Server Error */}
        {serverError ? (
          <View style={styles.serverErrorBox}>
            <Text style={styles.serverErrorText}>{serverError}</Text>
          </View>
        ) : null}

        {/* Submit */}
        <View style={ui.buttonContainer}>
          <Pressable onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
            <LinearGradient
              colors={[palette.primary, palette.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[ui.button, isSubmitting ? styles.disabled : null]}
            >
              <Text style={ui.buttonText}>
                {isSubmitting ? t("Đang xử lý...", "Processing...") : t("Đăng ký", "Register")}
              </Text>
              {!isSubmitting ? (
                <ArrowRight color="#fff" size={20} style={styles.arrowIcon} />
              ) : null}
            </LinearGradient>
          </Pressable>
        </View>

        <Pressable
          style={ui.buttonGhost}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginLink}>
            {t("Đã có tài khoản?", "Already have an account?")} <Text style={ui.buttonGhostText}>{t("Đăng nhập", "Log in")}</Text>
          </Text>
        </Pressable>
      </View>
    </ScreenGradient>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", marginBottom: 32 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", color: palette.ink, marginBottom: 8 },
  inputError: { borderColor: palette.danger },
  errorText: { color: palette.danger, fontSize: 12, marginTop: 4, marginLeft: 4 },
  otpHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  otpBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(147, 51, 234, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  otpSentBtn: { backgroundColor: "rgba(34, 197, 94, 0.08)" },
  otpBtnIcon: { marginRight: 4 },
  otpBtnText: { color: palette.primary, fontWeight: "600", fontSize: 13 },
  otpSentText: { color: "#22c55e" },
  serverErrorBox: {
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  serverErrorText: { color: palette.danger, fontSize: 14 },
  disabled: { opacity: 0.6 },
  arrowIcon: { marginLeft: 8 },
  loginLink: { color: palette.muted, fontSize: 14 },
});
