import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class GenerateReport {

    WebDriver driver;
    WebDriverWait wait;

    @BeforeEach
    void setUp() {
        ChromeOptions options = new ChromeOptions();
        // options.addArguments("--headless=new"); // Commented out to watch the
        // download!

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.manage().window().maximize();
    }

    @Test
    void testDownloadReportCardFlow() {
        // 1. Navigate and Login as a STUDENT
        driver.get("http://localhost:5173/");
        driver.findElement(By.xpath("//input[@placeholder='Enter your ID']")).sendKeys("STUD-2026-001");
        driver.findElement(By.xpath("//input[@placeholder='Enter your password']")).sendKeys("password123");

        // Note: Using a generic submit just in case the button text changes during the
        // click
        driver.findElement(By.xpath("//button[@type='submit']")).click();

        // 2. Navigate to Academic Report
        driver.findElement(By.xpath("//span[normalize-space()='Academic Report']")).click();

        // 3. Verify the page actually loaded by waiting for the Heading
        WebElement reportHeading = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.xpath("//h2[normalize-space()='Academic Report']")));
        reportHeading.click(); // Mimicking your Playwright click on the heading

        // 4. Click the Download Button
        driver.findElement(By.xpath("//button[normalize-space()='Download Full Report']")).click();

        // 5. THE SELENIUM DOWNLOAD TRICK:
        // We must pause Java to let Chrome actually download the file before we sign
        // out.
        // (Usually, we try to avoid Thread.sleep in Selenium, but for simple downloads,
        // it is the most reliable trick).
        try {
            Thread.sleep(3000); // Wait for 3 seconds
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // 6. Sign Out
        // Note: Playwright had a button, your XML had a span. Using contains() catches
        // both!
        driver.findElement(By.xpath("//*[contains(text(),'Sign Out')]")).click();

        // Verify we are back on login screen
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='Enter your ID']")));
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}