import Foundation
import CoreGraphics
import CoreText
import ImageIO
import UniformTypeIdentifiers

let sourcePath = "/Users/nick/Desktop/Scriberocks/webapp/public/scriberocks-header-source.png"
let logoPath = "/Users/nick/Desktop/Scriberocks/webapp/public/scriberocks-transparent.png"
let outputPath = "/Users/nick/Desktop/Scriberocks/webapp/public/scriberocks-header-3840x1646.png"

let targetWidth = 3840
let targetHeight = 1646
let scale: CGFloat = 1.6
let sourceHeight: CGFloat = 1200
let verticalCrop: CGFloat = (sourceHeight * scale - CGFloat(targetHeight)) / 2
let verticalShift: CGFloat = 60
let space = CGColorSpaceCreateDeviceRGB()
let background = CGColor(red: 0.968627, green: 0.968627, blue: 0.984314, alpha: 1)
let dark = CGColor(red: 0.105, green: 0.11, blue: 0.13, alpha: 1)
let gray = CGColor(red: 0.43, green: 0.44, blue: 0.48, alpha: 1)
let blue = CGColor(red: 0.12, green: 0.48, blue: 0.9, alpha: 1)
let panelBlue = CGColor(red: 0.91, green: 0.95, blue: 1, alpha: 1)
let titleText = "Write a rock."
let subtitleText = "Swipe through better versions."

let source = CGImageSourceCreateWithURL(URL(fileURLWithPath: sourcePath) as CFURL, nil)!
let base = CGImageSourceCreateImageAtIndex(source, 0, nil)!
let context = CGContext(
    data: nil,
    width: targetWidth,
    height: targetHeight,
    bitsPerComponent: 8,
    bytesPerRow: targetWidth * 4,
    space: space,
    bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
)!
context.setFillColor(background)
context.fill(CGRect(x: 0, y: 0, width: targetWidth, height: targetHeight))
context.draw(base, in: CGRect(x: 0, y: -verticalCrop - verticalShift, width: 3840, height: 1920))

func text(_ value: String, x: CGFloat, y: CGFloat, size: CGFloat, color: CGColor, bold: Bool = false) {
    let font = CTFontCreateWithName((bold ? "HelveticaNeue-Bold" : "HelveticaNeue") as CFString, size, nil)
    let attributed = NSAttributedString(string: value, attributes: [
        NSAttributedString.Key(rawValue: kCTFontAttributeName as String): font,
        NSAttributedString.Key(rawValue: kCTForegroundColorAttributeName as String): color
    ])
    context.textPosition = CGPoint(x: x, y: y)
    CTLineDraw(CTLineCreateWithAttributedString(attributed), context)
}

// Show a model-ranked substitution in the example card as the final layer.
context.setFillColor(background)
context.fill(CGRect(x: 1940, y: 400, width: 1900, height: 1246))
context.setFillColor(panelBlue)
context.fillEllipse(in: CGRect(x: 2250, y: 520, width: 1800, height: 1800))
context.setFillColor(CGColor.white)
let cardRect = CGRect(x: 1960, y: 860, width: 1450, height: 540)
context.addPath(CGPath(roundedRect: cardRect, cornerWidth: 42, cornerHeight: 42, transform: nil))
context.fillPath()
text("The river bank was quiet.", x: 2030, y: 1230, size: 84, color: dark)

let alternativeFont = CTFontCreateWithName("HelveticaNeue" as CFString, 84, nil)
let alternativeBoldFont = CTFontCreateWithName("HelveticaNeue-Bold" as CFString, 84, nil)
let alternative = NSMutableAttributedString(string: "The river bank was ")
alternative.addAttributes([
    NSAttributedString.Key(rawValue: kCTFontAttributeName as String): alternativeFont,
    NSAttributedString.Key(rawValue: kCTForegroundColorAttributeName as String): gray
], range: NSRange(location: 0, length: alternative.length))
let highlighted = NSAttributedString(string: "unruffled", attributes: [
    NSAttributedString.Key(rawValue: kCTFontAttributeName as String): alternativeBoldFont,
    NSAttributedString.Key(rawValue: kCTForegroundColorAttributeName as String): blue,
    NSAttributedString.Key(rawValue: kCTUnderlineStyleAttributeName as String): 1
])
alternative.append(highlighted)
let period = NSAttributedString(string: ".", attributes: [
    NSAttributedString.Key(rawValue: kCTFontAttributeName as String): alternativeFont,
    NSAttributedString.Key(rawValue: kCTForegroundColorAttributeName as String): gray
])
alternative.append(period)
context.textPosition = CGPoint(x: 2030, y: 1100)
CTLineDraw(CTLineCreateWithAttributedString(alternative), context)
text("context-aware alternatives", x: 2030, y: 940, size: 64, color: gray)

// Draw editable copy last so panel cleanup cannot clip or erase it.
context.setFillColor(background)
context.fill(CGRect(x: 0, y: 0, width: targetWidth, height: 560))
text("Keep your history. Branch freely.", x: 300, y: 300, size: 84, color: blue, bold: true)
text("Suggestions stay on your iPhone.", x: 2200, y: 320, size: 84, color: gray)
text("Casual or publishable prose.", x: 2200, y: 500, size: 84, color: gray)
context.setFillColor(background)
context.fill(CGRect(x: 100, y: 500, width: 1800, height: 1150))
text(titleText, x: 300, y: 720, size: 168, color: dark, bold: true)
text(subtitleText, x: 300, y: 540, size: 120, color: dark)

// Draw the supplied transparent mark after the editable text mask.
context.setFillColor(background)
context.fill(CGRect(x: 160, y: 1040, width: 832, height: 672))
let logoSource = CGImageSourceCreateWithURL(URL(fileURLWithPath: logoPath) as CFURL, nil)!
let transparentLogo = CGImageSourceCreateImageAtIndex(logoSource, 0, nil)!
context.draw(transparentLogo, in: CGRect(x: 206, y: 783, width: 600, height: 600))
text("Scriberocks", x: 300, y: 1300, size: 100, color: dark, bold: true)

let destination = CGImageDestinationCreateWithURL(URL(fileURLWithPath: outputPath) as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(destination, context.makeImage()!, nil)
precondition(CGImageDestinationFinalize(destination))
