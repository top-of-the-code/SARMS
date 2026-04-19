import java.util.Random;
import java.util.UUID;

public class TestDataGenerator {

    private static final Random random = new Random();

    // The 'static' keyword means other files can use this without creating a
    // TestDataGenerator object
    public static String generateRandomName(String prefix) {
        String alphabet = "abcdefghijklmnopqrstuvwxyz";
        StringBuilder randomString = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            randomString.append(alphabet.charAt(random.nextInt(alphabet.length())));
        }
        return prefix + " " + randomString.toString();
    }

    public static String generateRandomPhone() {
        return "9" + (100000000 + random.nextInt(900000000));
    }

    public static String generateRandomString(int length) {
        return UUID.randomUUID().toString().substring(0, Math.min(length, 32)).replace("-", "");
    }

    public static String generateRandomPincode() {
        return "11" + (1000 + random.nextInt(9000));
    }

    public static String generateRandomCourseCode() {
        // Generates a 3-digit number between 100 and 999 and converts it to a String
        return String.valueOf(100 + random.nextInt(900));
    }

    public static String generateRandomCourseName() {
        // String[] subjects = { "Robotics", "AI", "Data Science", "Networking",
        // "Security" };
        // String randomSubject = subjects[random.nextInt(subjects.length)];
        return "Advanced " + "test" + " " + generateRandomString(4).toUpperCase();
    }
}