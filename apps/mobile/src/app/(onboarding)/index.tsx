import { Text } from "~/components/ui/text";
import { Stack, useRouter } from "expo-router";
import { openSettings } from "expo-linking";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { Button } from "~/components/ui/button";
import { Alert, View } from "react-native";
import { FormSteps, useFormSteps } from "~/components/form-steps";
import { Small } from "~/components/ui/typography";
import { Camera } from "~/lib/icons/Camera";
import { RotateCcw } from "~/lib/icons/RotateCcw";
import {
  personalInfoSchema,
  contactInfoSchema,
  nomineeInfoSchema,
  documentsSchema,
  bankInfoSchema,
  addressInfoSchema,
} from "~/lib/validators";
import { useOnboardingStore } from "~/lib/hooks/useOnboardingStore";
import { getUTPublicUrl, useUploadHelpers } from "~/utils/uploadthing";
import { Image } from "expo-image";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useColorScheme } from "~/lib/useColorScheme";

function PersonalInfoForm() {
  const {
    setState,
    state: { personalInfo, ...state },
  } = useOnboardingStore();
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo,
  });

  const { next } = useFormSteps();

  async function onSubmit(values: z.infer<typeof personalInfoSchema>) {
    setState({ ...state, personalInfo: values });
    next();
  }

  return (
    <View className="flex-1 gap-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  onChangeText={field.onChange}
                  placeholder="Gean Gun Hi"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Of Birth</FormLabel>
              <FormControl>
                <Input {...field} onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <Button
        onPress={form.handleSubmit(onSubmit)}
        size={"lg"}
        className="mt-auto"
      >
        <Text>Next</Text>
        <ArrowRight className="size-4 text-primary-foreground" />
      </Button>
    </View>
  );
}

function ContactInfoForm() {
  const {
    setState,
    state: { contactInfo, ...state },
  } = useOnboardingStore();
  const form = useForm<z.infer<typeof contactInfoSchema>>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: contactInfo,
  });
  const { next, prev } = useFormSteps();

  async function onSubmit(values: z.infer<typeof contactInfoSchema>) {
    setState({ ...state, contactInfo: values });
    next();
  }

  return (
    <View className="flex-1 gap-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="primary_phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Phone Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  onChangeText={field.onChange}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alternative_phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternative Phone Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChangeText={field.onChange}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <View className="flex-row gap-4 mt-auto">
        <Button
          onPress={() => prev()}
          size={"lg"}
          variant={"secondary"}
          className="flex-1"
        >
          <ArrowLeft className="size-4 text-secondary-foreground" />
          <Text>Back</Text>
        </Button>
        <Button
          onPress={form.handleSubmit(onSubmit)}
          size={"lg"}
          className="flex-1"
        >
          <Text>Next</Text>
          <ArrowRight className="size-4 text-primary-foreground" />
        </Button>
      </View>
    </View>
  );
}

function NomineeInfoForm() {
  const {
    setState,
    state: { nomineeInfo, ...state },
  } = useOnboardingStore();
  const form = useForm<z.infer<typeof nomineeInfoSchema>>({
    resolver: zodResolver(nomineeInfoSchema),
    defaultValues: nomineeInfo,
  });
  const { next, prev } = useFormSteps();

  async function onSubmit(values: z.infer<typeof nomineeInfoSchema>) {
    setState({ ...state, nomineeInfo: values });
    next();
  }

  return (
    <View className="flex-1 gap-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} autoFocus onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <FormControl>
                <Input {...field} onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <View className="flex-row gap-4 mt-auto">
        <Button
          onPress={() => prev()}
          size={"lg"}
          variant={"secondary"}
          className="flex-1"
        >
          <ArrowLeft className="size-4 text-secondary-foreground" />
          <Text>Back</Text>
        </Button>
        <Button
          onPress={form.handleSubmit(onSubmit)}
          size={"lg"}
          className="flex-1"
        >
          <Text>Next</Text>
          <ArrowRight className="size-4 text-primary-foreground" />
        </Button>
      </View>
    </View>
  );
}

function DocumentsForm() {
  const {
    setState,
    state: { documents, ...state },
  } = useOnboardingStore();
  const form = useForm<z.infer<typeof documentsSchema>>({
    resolver: zodResolver(documentsSchema),
    defaultValues: documents,
  });
  const { next, prev } = useFormSteps();
  const { useImageUploader } = useUploadHelpers();
  const { openImagePicker, isUploading } = useImageUploader("imageUploader", {
    onClientUploadComplete: (res) => {
      setState({
        ...state,
        documents: { ...form.getValues(), aadhar_uri: res.at(0)?.key ?? "" },
      });
      form.setValue("aadhar_uri", res.at(0)?.key ?? "");
    },
    onUploadError: (error) => {
      console.log(error);
      Alert.alert("Upload Error", error.message, undefined, {
        userInterfaceStyle: "dark",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof documentsSchema>) {
    setState({ ...state, documents: values });
    next();
  }

  return (
    <View className="flex-1 gap-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="pan_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PAN Number</FormLabel>
              <FormControl>
                <Input {...field} autoFocus onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aadhar_uri"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aadhar Card</FormLabel>
              <FormControl>
                {field.value ? (
                  <>
                    <Image
                      source={{ uri: getUTPublicUrl(field.value) }}
                      style={{ width: "auto", height: 200, borderRadius: 6 }}
                    />
                    <Button
                      isLoading={isUploading}
                      onPress={() => {
                        openImagePicker({
                          allowsEditing: true,
                          source: "camera", // or "camera"
                          onInsufficientPermissions: () => {
                            Alert.alert(
                              "No Permissions",
                              "You need to grant permission to your Photos to use this",
                              [
                                { text: "Dismiss" },
                                {
                                  text: "Open Settings",
                                  onPress: openSettings,
                                },
                              ],
                              { userInterfaceStyle: "dark" }
                            );
                          },
                        });
                      }}
                      size={"lg"}
                      variant={"outline"}
                    >
                      <RotateCcw className="size-5 text-secondary-foreground" />
                      <Text>Re-Capture Image</Text>
                    </Button>
                  </>
                ) : (
                  <Button
                    isLoading={isUploading}
                    onPress={() => {
                      openImagePicker({
                        allowsEditing: true,
                        source: "camera", // or "camera"
                        onInsufficientPermissions: () => {
                          Alert.alert(
                            "No Permissions",
                            "You need to grant permission to your Photos to use this",
                            [
                              { text: "Dismiss" },
                              { text: "Open Settings", onPress: openSettings },
                            ],
                            { userInterfaceStyle: "dark" }
                          );
                        },
                      });
                    }}
                    size={"lg"}
                    variant={"outline"}
                  >
                    <Camera className="size-5 text-secondary-foreground" />
                    <Text>Capture Image</Text>
                  </Button>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <View className="flex-row gap-4 mt-auto">
        <Button
          onPress={() => prev()}
          size={"lg"}
          variant={"secondary"}
          className="flex-1"
        >
          <ArrowLeft className="size-4 text-secondary-foreground" />
          <Text>Back</Text>
        </Button>
        <Button
          onPress={form.handleSubmit(onSubmit)}
          size={"lg"}
          className="flex-1"
        >
          <Text>Next</Text>
          <ArrowRight className="size-4 text-primary-foreground" />
        </Button>
      </View>
    </View>
  );
}

function AddressInfoForm() {
  const {
    setState,
    state: { addressInfo, ...state },
  } = useOnboardingStore();

  const form = useForm<z.infer<typeof addressInfoSchema>>({
    resolver: zodResolver(addressInfoSchema),
    defaultValues: addressInfo,
  });

  const { next, prev } = useFormSteps();

  async function onSubmit(values: z.infer<typeof addressInfoSchema>) {
    setState({ ...state, addressInfo: values });
    next();
  }

  return (
    <View className="flex-1 gap-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="complete_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complete Address</FormLabel>
              <FormControl>
                <Input {...field} autoFocus onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
              <FormControl>
                <Input {...field} autoFocus onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} autoFocus onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input {...field} autoFocus onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <View className="flex-row gap-4 mt-auto">
        <Button
          onPress={() => prev()}
          size={"lg"}
          variant={"secondary"}
          className="flex-1"
        >
          <ArrowLeft className="size-4 text-secondary-foreground" />
          <Text>Back</Text>
        </Button>
        <Button
          onPress={form.handleSubmit(onSubmit)}
          size={"lg"}
          className="flex-1"
        >
          <Text>Next</Text>
          <ArrowRight className="size-4 text-primary-foreground" />
        </Button>
      </View>
    </View>
  );
}

function BankInfoForm() {
  const {
    setState,
    state: { bankInfo, ...state },
  } = useOnboardingStore();
  const form = useForm<z.infer<typeof bankInfoSchema>>({
    resolver: zodResolver(bankInfoSchema),
    defaultValues: bankInfo,
  });
  const { next, prev } = useFormSteps();
  const { getToken } = useAuth();
  const router = useRouter();
  const { user } = useUser();

  async function onSubmit(values: z.infer<typeof bankInfoSchema>) {
    setState({ ...state, bankInfo: values });
    const token = await getToken();
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        body: JSON.stringify({ onboardingComplete: true }),
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      await user?.reload();

      router.replace("/(home)");

      next();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View className="flex-1 gap-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input {...field} autoFocus onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Text>{JSON.stringify(form.formState.errors, undefined, 2)}</Text> */}
        <FormField
          control={form.control}
          name="confirm_account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Account Number</FormLabel>
              <FormControl>
                <Input {...field} onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="account_holder_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Holder Name</FormLabel>
              <FormControl>
                <Input {...field} onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ifsc_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IFSC Code</FormLabel>
              <FormControl>
                <Input {...field} onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="branch_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input {...field} onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="upi_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UPI Id</FormLabel>
              <FormControl>
                <Input {...field} onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="account_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <FormControl>
                <Input {...field} onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <View className="flex-row gap-4 mt-auto">
        <Button
          onPress={() => prev()}
          size={"lg"}
          variant={"secondary"}
          className="flex-1"
        >
          <ArrowLeft className="size-4 text-secondary-foreground" />
          <Text>Back</Text>
        </Button>
        <Button
          isLoading={form.formState.isSubmitting}
          onPress={form.handleSubmit(onSubmit)}
          size={"lg"}
          className="flex-1"
        >
          <Text>Next</Text>
          <ArrowRight className="size-4 text-primary-foreground" />
        </Button>
      </View>
    </View>
  );
}

export default function Index() {
  const { currentStep, totalSteps } = useFormSteps();
  const { currentStep: defaultStep, setCurrentStep } = useOnboardingStore();
  const labels = [
    "Personal Information",
    "Contact Information",
    "Documents",
    "Nominee Details",
    "Address Details",
    "Bank Account Details",
  ];
  const { isDarkColorScheme } = useColorScheme();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
    >
      <View className="px-6 py-8 pt-32 gap-6">
        <View className="flex-row gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <Animated.View
              key={index}
              className={"h-1 rounded-ful flex-1 bg-primary opacity-20"}
            >
              {currentStep >= index + 1 && (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(200)}
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${100}%` }}
                ></Animated.View>
              )}
            </Animated.View>
          ))}
        </View>
        <Stack.Screen
          options={{
            title: labels[currentStep - 1],
            headerShown: true,
            headerTitleStyle: {
              fontFamily: "Urbanist_400Regular",
            },
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerTransparent: true,
            headerRight: () => (
              <Small>
                {currentStep}/{totalSteps}
              </Small>
            ),
            headerBackground() {
              return (
                <BlurView
                  intensity={100}
                  tint={
                    isDarkColorScheme
                      ? "systemChromeMaterialDark"
                      : "systemChromeMaterialLight"
                  }
                  className="bg-background/10 h-full w-full flex-1"
                />
              );
            },
          }}
        />
        <FormSteps
          onStepChange={(step) => {
            setCurrentStep(step);
          }}
          defaultStep={defaultStep}
        >
          <PersonalInfoForm />
          <ContactInfoForm />
          <DocumentsForm />
          <NomineeInfoForm />
          <AddressInfoForm />
          <BankInfoForm />
        </FormSteps>
      </View>
    </ScrollView>
  );
}
