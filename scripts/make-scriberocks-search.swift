import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let inputPath = "/Users/nick/Desktop/Scriberocks/webapp/public/scriberocks-search-5244x2950.jpg"
let outputPath = "/Users/nick/Desktop/Scriberocks/webapp/public/scriberocks-search-5244x2950.png"
let source = CGImageSourceCreateWithURL(URL(fileURLWithPath: inputPath) as CFURL, nil)!
let image = CGImageSourceCreateImageAtIndex(source, 0, nil)!
let width = image.width
let height = image.height
let colorSpace = CGColorSpaceCreateDeviceRGB()
let context = CGContext(
    data: nil,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: width * 4,
    space: colorSpace,
    bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
)!
context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))

let destination = CGImageDestinationCreateWithURL(
    URL(fileURLWithPath: outputPath) as CFURL,
    UTType.png.identifier as CFString,
    1,
    nil
)!
CGImageDestinationAddImage(destination, context.makeImage()!, nil)
precondition(CGImageDestinationFinalize(destination))
