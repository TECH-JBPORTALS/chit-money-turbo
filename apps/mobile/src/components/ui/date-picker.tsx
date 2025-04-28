import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Input } from "./input";
import { useColorScheme } from "~/lib/useColorScheme";
import { TouchableOpacity } from "react-native";

export function DatePicker({
  value,
  onChange,
}: {
  value: Date;
  onChange?: ((event: DateTimePickerEvent, date?: Date) => void) | undefined;
}) {
  const { isDarkColorScheme } = useColorScheme();

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value,
      onChange,
      mode: "date",
      display: "spinner",
      positiveButton: {
        label: "Done",
        textColor: isDarkColorScheme ? "white" : "black",
      },
      negativeButton: { textColor: isDarkColorScheme ? "white" : "black" },
    });
  };

  return (
    <TouchableOpacity onPress={() => showDatePicker()}>
      <Input
        placeholder="Select date"
        readOnly
        value={value.toLocaleDateString()}
      />
    </TouchableOpacity>
  );
}
