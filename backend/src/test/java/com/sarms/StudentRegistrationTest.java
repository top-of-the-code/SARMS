package com.sarms;

import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class StudentRegistrationTest {

    WebDriver driver;
    WebDriverWait wait;

    @BeforeEach
    void setUp() {
        ChromeOptions options = new ChromeOptions();
        // COMMENT THIS OUT OR DELETE IT to see the browser again!
        // options.addArguments("--headless=new");

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.manage().window().maximize();
    }

    @Test
    void testStudentRegistrationFlow() {
        // 1. Generate Valid Test Data (Names now only have letters!)
        String studentName = TestDataGenerator.generateRandomName("Student");
        String fatherName = TestDataGenerator.generateRandomName("Father");
        String motherName = TestDataGenerator.generateRandomName("Mother");
        String phone1 = TestDataGenerator.generateRandomPhone();
        String phone2 = TestDataGenerator.generateRandomPhone();
        String apt = TestDataGenerator.generateRandomString(6);
        String road = TestDataGenerator.generateRandomString(10);
        String city = "City" + TestDataGenerator.generateRandomString(3);
        String state = "State" + TestDataGenerator.generateRandomString(3);
        String pincode = TestDataGenerator.generateRandomPincode();

        // 2. Navigate and Login
        driver.get("http://localhost:5173/");
        driver.findElement(By.xpath("//input[@placeholder='Enter your ID']")).sendKeys("ADM-001");
        driver.findElement(By.xpath("//input[@placeholder='Enter your password']")).sendKeys("password123");
        driver.findElement(By.xpath("//button[text()='Sign In']")).click(); // Fixed from 'Authenticating...'

        // 3. Navigate to Registration
        driver.findElement(By.xpath("//span[normalize-space()='Student Registration']")).click();

        // 4. Fill Student Details
        driver.findElement(By.xpath("//input[@placeholder='e.g. John Doe']")).sendKeys(studentName);
        driver.findElement(By.cssSelector("input[type='date']")).sendKeys("19-03-2005");
        driver.findElement(By.xpath("//input[@placeholder=\"Father's full name\"]")).sendKeys(fatherName);
        driver.findElement(By.xpath("//input[@placeholder=\"Mother's full name\"]")).sendKeys(motherName);

        // 5. Fill Contact Details (Using your corrected XPaths!)
        driver.findElement(By.xpath("//input[@placeholder='+91 87654 32100']")).sendKeys(phone1);
        driver.findElement(By.xpath("//input[@placeholder='+91 98765 43210']")).sendKeys(phone2);

        // 6. Fill Address Details
        driver.findElement(By.xpath("//input[@placeholder='e.g. Apt 4B']")).sendKeys(apt);
        driver.findElement(By.xpath("//input[@placeholder='e.g. Example Road']")).sendKeys(road);
        driver.findElement(By.xpath("//input[@placeholder='e.g. New Delhi']")).sendKeys(city);
        driver.findElement(By.xpath("//input[@placeholder='e.g. Delhi']")).sendKeys(state);
        driver.findElement(By.xpath("//input[@placeholder='e.g. 110001']")).sendKeys(pincode);

        // 7. Year/Class
        // 7. Year/Class
        WebElement yearInput = driver.findElement(By.cssSelector("input[type='number']"));
        yearInput.clear(); // Deletes the 2026
        yearInput.sendKeys("2025"); // Types the 2025

        // 8. Submit
        driver.findElement(By.xpath("//button[normalize-space()='Confirm Registration']")).click();

        // 9. Success Modal Interactions (Waiting for it to appear)
        WebElement successHeading = wait.until(ExpectedConditions
                .visibilityOfElementLocated(By.xpath("//h2[normalize-space()='Registration Successful']")));
        successHeading.click();

        // Fixed from 'Copied Password' to catch the button before you click it
        driver.findElement(By.xpath("//button[contains(text(), 'Copy Password')]")).click();

        // 10. Sign Out
        driver.findElement(By.xpath("//span[contains(text(),'Sign Out')]")).click();

        // Verify we are back on login screen
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='Enter your ID']")))
                .click();
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}