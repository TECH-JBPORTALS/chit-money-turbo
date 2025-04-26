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
  subscriberPersonalInfoSchema,
  subscriberContactInfoSchema,
  nomineeInfoSchema,
  subscriberDocumentsSchema,
  subscriberBankInfoSchema,
  subscriberAddressInfoSchema,
} from "@cmt/validators";
import { useOnboardingStore } from "~/lib/hooks/useOnboardingStore";
import { getUTPublicUrl, useUploadHelpers } from "~/utils/uploadthing";
import { Image } from "expo-image";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useColorScheme } from "~/lib/useColorScheme";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "~/utils/api";

function PersonalInfoForm() {
  const {
    setState,
    state: { personalInfo, ...state },
  } = useOnboardingStore();
  const form = useForm<z.infer<typeof subscriberPersonalInfoSchema>>({
    resolver: zodResolver(subscriberPersonalInfoSchema),
    defaultValues: personalInfo,
  });

  const { next } = useFormSteps();

  async function onSubmit(
    values: z.infer<typeof subscriberPersonalInfoSchema>
  ) {
    setState({ ...state, personalInfo: values });
    next();
  }

  return (
    <View className="flex-1 gap-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  onChangeText={field.onChange}
                  placeholder="Badhra"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  onChangeText={field.onChange}
                  placeholder="Kumar"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
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
  const form = useForm<z.infer<typeof subscriberContactInfoSchema>>({
    resolver: zodResolver(subscriberContactInfoSchema),
    defaultValues: contactInfo,
  });
  const { next, prev } = useFormSteps();

  async function onSubmit(values: z.infer<typeof subscriberContactInfoSchema>) {
    setState({ ...state, contactInfo: values });
    next();
  }

  return (
    <View className="flex-1 gap-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="primaryPhoneNumber"
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
          name="secondaryPhoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Phone Number</FormLabel>
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
          name="nomineeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nominee Full Name</FormLabel>
              <FormControl>
                <Input {...field} autoFocus onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nomineeRelationship"
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
  const form = useForm<z.infer<typeof subscriberDocumentsSchema>>({
    resolver: zodResolver(subscriberDocumentsSchema),
    defaultValues: documents,
  });
  const { next, prev } = useFormSteps();
  const { useImageUploader } = useUploadHelpers();
  const {
    openImagePicker: aadharFrontImagePicker,
    isUploading: isAadharFrontImageUploading,
  } = useImageUploader("imageUploader", {
    onClientUploadComplete: (res) => {
      setState({
        ...state,
        documents: {
          ...form.getValues(),
          aadharFrontFileKey: res.at(0)?.key ?? "",
        },
      });
      form.setValue("aadharFrontFileKey", res.at(0)?.key ?? "");
    },
    onUploadError: (error) => {
      console.log(error);
      Alert.alert("Upload Error", error.message, undefined, {
        userInterfaceStyle: "dark",
      });
    },
  });

  const {
    openImagePicker: aadharBackImagePicker,
    isUploading: isAadharBackImageUploading,
  } = useImageUploader("imageUploader", {
    onClientUploadComplete: (res) => {
      setState({
        ...state,
        documents: {
          ...form.getValues(),
          aadharFrontFileKey: res.at(0)?.key ?? "",
        },
      });
      form.setValue("aadharBackFileKey", res.at(0)?.key ?? "");
    },
    onUploadError: (error) => {
      console.log(error);
      Alert.alert("Upload Error", error.message, undefined, {
        userInterfaceStyle: "dark",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof subscriberDocumentsSchema>) {
    setState({ ...state, documents: values });
    next();
  }

  return (
    <View className="flex-1 gap-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="panCardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PAN Card Number</FormLabel>
              <FormControl>
                <Input {...field} autoFocus onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aadharFrontFileKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Aadhar Card Photo (front)"}</FormLabel>
              <FormControl>
                {field.value ? (
                  <>
                    <Image
                      source={{ uri: getUTPublicUrl(field.value) }}
                      style={{ width: "auto", height: 200, borderRadius: 6 }}
                    />
                    <Button
                      isLoading={isAadharFrontImageUploading}
                      onPress={() => {
                        aadharFrontImagePicker({
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
                    isLoading={isAadharFrontImageUploading}
                    onPress={() => {
                      aadharFrontImagePicker({
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

        <FormField
          control={form.control}
          name="aadharBackFileKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Aadhar Card Photo (back)"}</FormLabel>
              <FormControl>
                {field.value ? (
                  <>
                    <Image
                      source={{ uri: getUTPublicUrl(field.value) }}
                      style={{ width: "auto", height: 200, borderRadius: 6 }}
                    />
                    <Button
                      isLoading={isAadharBackImageUploading}
                      onPress={() => {
                        aadharBackImagePicker({
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
                    isLoading={isAadharBackImageUploading}
                    onPress={() => {
                      aadharBackImagePicker({
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

  const form = useForm<z.infer<typeof subscriberAddressInfoSchema>>({
    resolver: zodResolver(subscriberAddressInfoSchema),
    defaultValues: addressInfo,
  });

  const { next, prev } = useFormSteps();

  async function onSubmit(values: z.infer<typeof subscriberAddressInfoSchema>) {
    setState({ ...state, addressInfo: values });
    next();
  }

  return (
    <View className="flex-1 gap-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="addressLine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line</FormLabel>
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
  const form = useForm<z.infer<typeof subscriberBankInfoSchema>>({
    resolver: zodResolver(subscriberBankInfoSchema),
    defaultValues: bankInfo,
  });
  const { next, prev } = useFormSteps();
  const { getToken } = useAuth();
  const router = useRouter();
  const { user } = useUser();
  const { mutateAsync: createProfile } = useMutation(
    trpc.subscribers.createProfile.mutationOptions()
  );

  async function onSubmit(values: z.infer<typeof subscriberBankInfoSchema>) {
    setState({ ...state, bankInfo: values });

    const token = await getToken();
    try {
      // 1. Create profile
      await createProfile({ ...state, bankInfo });

      // 2. Update onboarding state
      await fetch("/api/onboarding", {
        method: "POST",
        body: JSON.stringify({ onboardingComplete: true }),
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      // 3. Reload state
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
          name="accountNumber"
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
          name="confirmAccountNumber"
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
          name="accountHolderName"
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
          name="ifscCode"
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
          name="branchName"
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
          name="upiId"
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
          name="accountType"
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

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} onChangeText={field.onChange} />
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
                <Input {...field} onChangeText={field.onChange} />
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
              className={"h-1 rounded-ful flex-1 bg-accent"}
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
