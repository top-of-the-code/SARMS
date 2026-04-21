package com.sarms;

import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class ForgotPasswordTest {

    WebDriver driver;
    WebDriverWait wait;

    @BeforeEach
    void setUp() {
        ChromeOptions options = new ChromeOptions();
        // options.addArguments("--headless=new");

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.manage().window().maximize();
    }

    @Test
    void testForgotPasswordAndLoginFlow() {
        // 1. Navigate to Login
        driver.get("http://localhost:5173/");

        // 2. Attempt Login with WRONG password (password321)
        driver.findElement(By.xpath("//input[@placeholder='Enter your ID']")).sendKeys("ADM-001");
        driver.findElement(By.xpath("//input[@placeholder='Enter your password']")).sendKeys("password321");
        driver.findElement(By.xpath("//button[normalize-space()='Sign In']")).click();

        // 3. Wait for the error to appear, then click Forgot Password
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(), 'Invalid')]")));
        driver.findElement(By.xpath("//button[normalize-space()='Forgot Password?']")).click();

        // 4. Reset Password Flow - Step 1: Verify ID
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='Enter your ID']")))
                .sendKeys("ADM-001");
        driver.findElement(By.xpath("//button[normalize-space()='Verify ID']")).click();

        // 5. Reset Password Flow - Step 2: Enter new password (password123)
        wait.until(ExpectedConditions
                .visibilityOfElementLocated(By.xpath("//input[@placeholder='Create a new password']")))
                .sendKeys("password123");
        driver.findElement(By.xpath("//input[@placeholder='Confirm new password']")).sendKeys("password123");
        driver.findElement(By.xpath("//button[normalize-space()='Update Password']")).click();

        // 6. Click Back to Login (Safely handling the React DOM re-render)
        By backToLoginLocator = By.xpath("//button[normalize-space()='Back to Login']");
        try {
            wait.until(ExpectedConditions.elementToBeClickable(backToLoginLocator)).click();
        } catch (StaleElementReferenceException e) {
            // If the button goes stale mid-click, we find the fresh one and click it
            wait.until(ExpectedConditions.elementToBeClickable(backToLoginLocator)).click();
        }

        // 7. Clear old wrong password and enter the new one
        WebElement passField = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='Enter your password']")));
        passField.sendKeys(Keys.chord(Keys.COMMAND, "a"), "password123");

        // Click Sign In
        driver.findElement(By.xpath("//button[normalize-space()='Sign In']")).click();

        // 8. Verify Successful Login & Sign Out
        WebElement signOutButton = wait.until(ExpectedConditions
                .elementToBeClickable(By.xpath("//*[contains(text(),'Sign Out') or normalize-space()='Sign Out']")));
        signOutButton.click();

        // Verify we are safely back on the login screen
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='Enter your ID']")));
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}