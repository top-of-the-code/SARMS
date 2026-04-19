import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class CreateCourseTest {

    WebDriver driver;
    WebDriverWait wait;

    @BeforeEach
    void setUp() {
        ChromeOptions options = new ChromeOptions();
        // options.addArguments("--headless=new"); // Keep commented so you can watch it
        // run

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.manage().window().maximize();
    }

    @Test
    void testCreateCourseFlow() {
        // 1. Generate Dynamic Course Data
        String courseCode = TestDataGenerator.generateRandomCourseCode();
        String courseName = TestDataGenerator.generateRandomCourseName();

        // 2. Login as Admin
        driver.get("http://localhost:5173/");
        driver.findElement(By.xpath("//input[@placeholder='Enter your ID']")).sendKeys("ADM-001");
        driver.findElement(By.xpath("//input[@placeholder='Enter your password']")).sendKeys("password123");
        driver.findElement(By.xpath("//button[normalize-space()='Sign In']")).click();

        // 3. Click Create New Course
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[normalize-space()='Create New Course']")))
                .click();

        // 4. Fill Course Code and Name
        driver.findElement(By.xpath("//input[contains(@placeholder, 'e.g.')]")).sendKeys(courseCode);
        driver.findElement(By.xpath("//input[@placeholder='Full Course Name']")).sendKeys(courseName);

        // 5. Submit (Using the exact button text Playwright found!)
        driver.findElement(By.xpath("//button[normalize-space()='Save Changes']")).click();

        // 6. Click the newly created course in the table dynamically
        String dynamicTableXPath = "//td[@title='" + courseName + "']";
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(dynamicTableXPath))).click();

        // 7. Sign Out
        driver.findElement(By.xpath("//*[contains(text(),'Sign Out')]")).click();

        // Verify sign out was successful by waiting for the login screen ID field
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='Enter your ID']")));
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}